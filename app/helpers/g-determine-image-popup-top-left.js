import Ember from 'ember';
import $ from 'jquery';

export function gDetermineImagePopupTopLeft([containerElemntId, imgWidth, imgHeight]) {
  var ret = {},
    ele = $('#'+containerElemntId),
    width = ele.width();
  if(imgWidth > (width*0.7) && imgWidth >= (imgHeight*3)) {
    // horizontal
    ret.placeTop = true;
    ret.width = imgWidth > width ? width : imgWidth;
  } else {
    // vitical
    ret.placeTop = false;
  }
  return ret;
}

export default Ember.Helper.helper(gDetermineImagePopupTopLeft);
