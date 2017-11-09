import Ember from 'ember';

// divide into lines
function _divide_to_fit_lines(items, defSize){
	var defWidth = defSize.width,
		defHeight = defSize.height,
		defMargin = defSize.margin;
  var idx = 0,
    row = [],
    currW = 0,
    lastW = 0,
    w,h,scaleH,scaleW,
	  item;
  while(item=items[idx++]){
    // get image width and height
    if(!item.fitsize || !item.fitsize.oriW || !item.fitsize.oriH) {
      //Ember.Logger.error('require item property fitsize:{oriW,oriH} to calculate size. error at ' + (idx-1));
      w=defHeight, h=defHeight;
    } else {
      w=item.fitsize.oriW, h=item.fitsize.oriH;
    }
    // set to default height
    // and scale with width
    scaleH=defHeight;
    scaleW=scaleH/h*w;
    // store last width
    lastW=currW;
    // sum element width
    currW+=scaleW+defMargin;
    if(currW>=defWidth){
      // judge to add or remove an element
      if(currW-defWidth<defWidth-lastW){
        // add element
        row.push({w,h,item});
        setRowImgSize(row, currW-defWidth, defHeight);
        // clear
        row=[],currW=0;
      }else{
        // remove element
        setRowImgSize(row, lastW-defWidth, defHeight);
        // clear
        row=[{w,h,item}],currW=scaleW+defMargin;
      };
    }else row.push({w,h,item});// need more
  };
  // rest
  if(currW)setRowImgSize(row, 0, defHeight);
}

// calculate the row width
function setRowImgSize(row, overflow, defHeight){
  var ds = 0,
    idx = 0,
    ele,scaleW,scaleH;
  while(ele=row[idx++])ds+=ele.w/ele.h;
  scaleH=defHeight-overflow/ds;
  idx=0;
  while(ele=row[idx++]){
    scaleW=scaleH/ele.h*ele.w|0;
    Ember.set(ele, 'item.fitsize.fitW', scaleW);
    Ember.set(ele, 'item.fitsize.fitH', scaleH);
    Ember.set(ele, 'item.fitsize.fitL', scaleH);
  };
}

//  argument 'items' element should has property 'fitsize:{oriW, oriH}'
//  argument 'defSize' like: {
//    width: 1920, // container default width
//    height: 320, // default line height
//    margin: 10, // margin between image
//  }
//  the function will add attribute 'fitsize:{w,h,lh}' to item
export default function fitPhotoWall(items, defSize) {
  _divide_to_fit_lines(items, defSize);
}
