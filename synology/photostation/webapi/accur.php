<?php
require_once('shared_album.inc.php');
require_once('photoutil.php');
require_once("../include/advanced_shared_album.php");

class AccurSharedAlbumAPI extends WebAPI
{
	private $TableName, $PhotoTableName, $VideoTableName, $UserID;
	private $allowSortByArray = array('filename' => 'upper(name)', 'share_status' => 'share_status', 'createdate' => 'create_date');

	private $resp;
	private $error;

	function __construct()
	{
		parent::__construct(SZ_WEBAPI_API_DESCRIPTION_PATH);
	}

	protected function Process()
	{
		csSYNOPhotoDB::GetDBInstance()->SetSessionCache();

		$this->UserID = isset($_SESSION[SYNOPHOTO_ADMIN_USER]['reg_syno_userid']) ? $_SESSION[SYNOPHOTO_ADMIN_USER]['reg_syno_userid'] : 0;

		$this->UserTableName = SHARED_ALBUM_TABLE_NAME;
		$this->AdminTableName = SHARED_ALBUM_ADMIN_TABLE_NAME;

		$result = $this->SharedAlbumList();

		$result['admuid'] = SYNOPHOTO_ADMIN_USER;

		$this->SetResponse2($result);
	}

	private function SharedAlbumList()
	{
		$result['items'] = array();
		$isAdmTable = $this->TableName === SHARED_ALBUM_ADMIN_TABLE_NAME;

		if (!isset($_REQUEST['offset']) || !isset($_REQUEST['limit']) || !is_numeric($_REQUEST['offset']) || !is_numeric($_REQUEST['limit'])) {
			$this->SetError(PHOTOSTATION_SHARED_ALBUM_BAD_PARAMS);
			goto End;
		}
		$offset = $_REQUEST['offset'] + 0;
		$limit = $_REQUEST['limit'] + 0;
		$sortBy = $this->allowSortByArray['filename'];
		$sortDirection = 'ASC';
		$additional = array();

		if (isset($_REQUEST['sort_by']) && array_key_exists($_REQUEST['sort_by'], $this->allowSortByArray)) {
			$sortBy = $this->allowSortByArray[$_REQUEST['sort_by']];
		}
		if (isset($_REQUEST['sort_direction']) && strtolower($_REQUEST['sort_direction']) === 'desc') {
			$sortDirection = 'DESC';
		}
		if (isset($_REQUEST['additional'])) {
			$additional = explode(",", $_REQUEST['additional']);
		}
		$query = 0;

		$selectFields = 'id, name, is_shared, start_time, end_time, sharelink, create_date, is_album, shareid, recursive';
		$query = "SELECT id,sharelink,userid FROM ("
			. " SELECT 0 as userid, " . $selectFields . " from " . $this->AdminTableName . " WHERE hidden = 'f' "
			. "   UNION ALL "
			. " SELECT userid, " . $selectFields . " from " . $this->UserTableName . " WHERE hidden = 'f' "
			. ") WHERE ";

		$sqlParams = array();
		$this->appendUserIDCond($query, $sqlParams);

		// we will add sharedalbum_single in this method,
		// so regulate the offset/limit to get correct shared_album information
		if ($offset === 0) {
			$shared_limit = $limit -1;
			$shared_offset = 0;
		} else {
			$shared_limit = $limit;
			$shared_offset = $offset - 1;
		}
		$limitOffsetString = PHOTO_DB_GetLimitOffsetString($shared_limit, $shared_offset);
		if ('share_status' === $sortBy) {
			$currentDate = 'root' === SYNOPHOTO_ADMIN_USER ? 'current_date' : "date('now')";
			$query .= "ORDER BY shareid desc, CASE " .
				"WHEN is_shared = 'f' THEN 0 " . // none
				"WHEN start_time IS NULL OR end_time IS NULL THEN 2 ". // valid
				"WHEN start_time > $currentDate OR end_time < $currentDate THEN 1 ". // invalid
				"ELSE 2 ". // valid
				"END $sortDirection, upper(name) ASC";
		} else {
			$query .= "ORDER BY shareid desc, $sortBy $sortDirection";
		}
		$query .= " $limitOffsetString";
		$db_result = PHOTO_DB_Query($query, $sqlParams);

		$i = 0;
// TODO: add single share support
//		if ((int)$offset === 0) {
//			$sharedAlbum = SharedAlbum::GetHiddenAlbumInfo(NULL, $additional);
//			if ($sharedAlbum !== NULL) {
//				$sharedAlbum = $this->GetInfoById(explode("_", $sharedAlbum['id'])[1], $additional);
//			}
//			if ($sharedAlbum !== NULL) {
//				$sharedAlbum['id'] = 'sharedalbum_single';
//				if (isset($sharedAlbum['additional']['public_share']['public_share_url'])) {
//					unset($sharedAlbum['additional']['public_share']['public_share_url']);
//				}
//				$result['items'][$i] = $sharedAlbum;
//				$i ++;
//			}
//		}

		while(($idRow = PHOTO_DB_FetchRow($db_result))) {
			$sharedAlbum = $this->GetInfoById($idRow[0], $idRow[1], $idRow[2], $additional);
			if (NULL === $sharedAlbum) {
				continue;
			}
			$result['items'][$i] = $sharedAlbum;
			$i ++;
		}

		$total = $i;
		$result['total'] = $total;
		$result['offset'] = (-1 == $limit || $offset + $limit > $total) ? $total : $offset + $limit;

	End:
		return $result;
	}

	private function GetInfoById($sharedAlbumId, $sharelink, $userID, $additional = array()) {
		$sharedAlbum = SharedAlbum::GetInfoById($sharedAlbumId, $userID, $additional);

		if ($sharedAlbum === NULL) {
			return NULL;
		}

		$thumbSize['preview']['resolutionx'] = 0;
		$thumbSize['preview']['resolutiony'] = 0;
		$thumbSize['small']['resolutionx'] = 0;
		$thumbSize['small']['resolutiony'] = 0;
		$thumbSize['large']['resolutionx'] = 0;
		$thumbSize['large']['resolutiony'] = 0;
		$thubmSize['sig'] = "";
		$cover = SharedAlbum::GetSharedAlbumCover(NULL, $sharelink);
		$getRealPath = ('root' === SYNOPHOTO_ADMIN_USER) ? false : true;
		if ($cover === NULL) {
			$sharedAlbum['thumbnail_status'] = 'default';
		} else if (false !== ($item = PhotoAPIUtil::getItemByPath($cover['path'], array('thumb_size'), $cover['type'], $getRealPath))) {
			$sharedAlbum['thumbnail_status'] = $item['thumbnail_status'];
			$thumbSize = $item['additional']['thumb_size'];
		}
		if (in_array("thumb_size", $additional)) {
			$sharedAlbum['additional']['thumb_size'] = $thumbSize;
		}
		if ($sharedAlbum['shareid']) {
			$albums = Album::GetByShareId(array($sharedAlbum['shareid']));
			if (0 !== count($albums)) {
				$sharedAlbum['physical_path'] = $albums[0]['sharename'];
			}
		}
		$sharedAlbum['is_album'] = $sharedAlbum['shareid'] > 0;
		unset($sharedAlbum['shareid']);
		return $sharedAlbum;
	}

	private function appendUserIDCond(&$sql, &$sqlParams)
	{
		$useridCond = " 1=1 ";
		//if (!PHOTO_DB_IsAdminUid($this->UserID)) {
		//	$useridCond = " userid = ? ";
		//	$sqlParams[] = $this->UserID;
		//}

		$sql = $sql . $useridCond;
	}

	public function Run2() {
		if (!isset($_REQUEST[SZK_PARAM_API]) || !isset($_REQUEST[SZK_PARAM_METHOD]) || !isset($_REQUEST[SZK_PARAM_VERSION])) {
			$this->SetError(WEBAPI_ERR_BAD_REQUEST);
			goto End;
		}
//		if ($this->CheckSessionTimeout()) {
//			header('x-request-error: error_timeout');
//			goto End;
//		}

		$this->api = $_REQUEST[SZK_PARAM_API];
		$this->method = $_REQUEST[SZK_PARAM_METHOD];
		$this->version = $_REQUEST[SZK_PARAM_VERSION];

//		if (!$this->CheckRequestParam($api, $method, $version)) {
//			goto End;
//		}

//		if (!$this->CheckPermission()) {
//			goto End;
//		}

		$this->Process();

	End:
		$this->OutputResponse2();
		return;
	}

	protected function SetResponse2($resp) {
		$this->resp = $resp;
		$this->error = WEBAPI_ERR_NONE;
	}

	protected function SetError2($error) {
		$this->resp = NULL;
		$this->error = $error;
	}

	private function OutputResponse2() {
		$resp = array();

		if (WEBAPI_ERR_NONE != $this->error) {
			$resp[SZK_RESP_SUCCESS] = false;
			$resp[SZK_RESP_ERROR][SZK_RESP_ERROR_CODE] = $this->error;
			goto End;
		}

		$resp[SZK_RESP_SUCCESS] = true;
		if (!is_null($this->resp)) {
			$resp[SZK_RESP_DATA] = $this->resp;
		}
		End:
		if (!$this->headerSent) {
			$this->headerSent = true;
			header('Content-type: text/plain; charset=utf-8');
		}
		echo(json_encode($resp));
	}
}

$api = new AccurSharedAlbumAPI();
$api->Run2();

?>
