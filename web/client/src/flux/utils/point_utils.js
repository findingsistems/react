'use strict';

var pt_in_sect = (x, a, b) => (x - a)*(x - b) <= 0;

module.exports.pt_in_rect = (pt, rect) => 
  pt_in_sect(pt[0], rect[0][0], rect[1][0]) && pt_in_sect(pt[1], rect[0][1], rect[1][1]);

