/* F07's ordinary-word oracle. The browser measurement is read-only and has no
 * module closure: the owner driver evaluates measureGuidanceWord.toString().
 * Save its complete result BEFORE calling the host assertion. This check does
 * not replace the owner's 0.1px layout guards or its long-hint scroll checks.
 */
'use strict';

function measureGuidanceWord() {
  function rect(value) {
    return {x:value.x,y:value.y,left:value.left,top:value.top,
      right:value.right,bottom:value.bottom,width:value.width,height:value.height};
  }
  function identity(element) {
    return element.tagName.toLowerCase()+(element.id?'#'+element.id:'')+
      (element.classList.length?'.'+Array.from(element.classList).join('.'):'');
  }
  function style(element,pseudo) {
    if(!element)return null;
    var s=getComputedStyle(element,pseudo||null),out={};
    ['display','visibility','opacity','contentVisibility','position','content',
      'font','fontSize','fontFamily','fontWeight','fontStyle','fontStretch',
      'lineHeight','letterSpacing','wordSpacing','textTransform','whiteSpace',
      'overflowWrap','wordBreak','textOverflow','color','textShadow',
      'width','height','minWidth','maxWidth','minHeight','maxHeight',
      'boxSizing','paddingTop','paddingRight','paddingBottom','paddingLeft',
      'borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth',
      'overflowX','overflowY','overflowClipMargin','borderRadius','clip','clipPath',
      'contain','transform','gridArea','gridTemplateColumns','alignItems',
      'justifyContent'].forEach(function(key){out[key]=s[key]===undefined?null:s[key];});
    return out;
  }
  function elementRecord(element) {
    if(!element)return null;
    var box=element.getBoundingClientRect();
    return {element:identity(element),rect:rect(box),style:style(element),
      client:{left:box.left+element.clientLeft,top:box.top+element.clientTop,
        right:box.left+element.clientLeft+element.clientWidth,
        bottom:box.top+element.clientTop+element.clientHeight,
        width:element.clientWidth,height:element.clientHeight},
      scroll:{left:element.scrollLeft,top:element.scrollTop,
        width:element.scrollWidth,height:element.scrollHeight},
      offset:{width:element.offsetWidth,height:element.offsetHeight},
      hidden:element.hidden===true,ariaHidden:element.getAttribute('aria-hidden')};
  }
  function textRange(element,start,end) {
    var walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT),node,
      entries=[],offset=0;
    while((node=walker.nextNode())) {
      entries.push({node:node,start:offset,end:offset+node.data.length});
      offset+=node.data.length;
    }
    var first=entries.find(function(entry){return start>=entry.start&&start<entry.end;}),
      last=entries.find(function(entry){return end>entry.start&&end<=entry.end;});
    if(!first||!last)return {rects:[],bounds:null};
    var range=document.createRange();
    range.setStart(first.node,start-first.start);range.setEnd(last.node,end-last.start);
    return {rects:Array.from(range.getClientRects()).map(rect),bounds:rect(range.getBoundingClientRect())};
  }
  function textRecord(element) {
    if(!element)return null;
    var result=elementRecord(element),text=element.textContent||'';
    result.text=text;result.renderedText=element.innerText;
    result.textRange=text.length?textRange(element,0,text.length):{rects:[],bounds:null};
    return result;
  }

  var title=document.querySelector('#rift-objective .objective-copy strong'),
    detail=document.querySelector('#rift-objective .objective-copy small'),
    toggle=document.querySelector('#rift-hints-toggle'),
    row=document.querySelector('#rift-objective-row'),
    arrow=document.querySelector('#rift-objective .objective-arrow'),
    root=document.documentElement,
    titleText=title?(title.textContent||''):'',
    match=/^\s*([A-Za-z]+(?:['\u2019-][A-Za-z]+)*)/.exec(titleText),
    wordText=match?match[1]:'',wordStart=match?match[0].length-wordText.length:0,
    wordRange=title&&wordText?textRange(title,wordStart,wordStart+wordText.length):{rects:[],bounds:null},
    glyphs=[],offset=wordStart;
  Array.from(wordText).forEach(function(character){
    var end=offset+character.length,range=textRange(title,offset,end);
    glyphs.push({text:character,start:offset,end:end,rects:range.rects,bounds:range.bounds});offset=end;
  });

  var ancestors=[],clippingAncestors=[],invisibleAncestors=[];
  for(var element=title;element;element=element.parentElement) {
    var entry=elementRecord(element),s=entry.style;
    // A transparent line box is NOT a clipping edge. Only actual overflow or
    // paint containment limits the glyph range. Keep all ancestors as evidence.
    var paintContain=/(^|\s)(paint|strict|content)(\s|$)/.test(s.contain||''),
      clipsX=/^(auto|scroll|hidden|clip)$/.test(s.overflowX)||paintContain,
      clipsY=/^(auto|scroll|hidden|clip)$/.test(s.overflowY)||paintContain;
    entry.clipsX=clipsX;entry.clipsY=clipsY;entry.paintContain=paintContain;
    ancestors.push(entry);
    if(clipsX||clipsY)clippingAncestors.push({element:entry.element,
      clipsX:clipsX,clipsY:clipsY,client:entry.client,overflowX:s.overflowX,
      overflowY:s.overflowY,paintContain:paintContain,overflowClipMargin:s.overflowClipMargin});
    if(entry.hidden||s.display==='none'||s.visibility==='hidden'||s.visibility==='collapse'||
      s.contentVisibility==='hidden'||Number(s.opacity)===0)invisibleAncestors.push(entry.element);
  }
  var viewport={left:0,top:0,right:root.clientWidth||innerWidth,
    bottom:root.clientHeight||innerHeight,width:root.clientWidth||innerWidth,
    height:root.clientHeight||innerHeight};
  var effectiveClip={left:viewport.left,top:viewport.top,right:viewport.right,bottom:viewport.bottom};
  clippingAncestors.forEach(function(entry){
    if(entry.clipsX){effectiveClip.left=Math.max(effectiveClip.left,entry.client.left);effectiveClip.right=Math.min(effectiveClip.right,entry.client.right);}
    if(entry.clipsY){effectiveClip.top=Math.max(effectiveClip.top,entry.client.top);effectiveClip.bottom=Math.min(effectiveClip.bottom,entry.client.bottom);}
  });
  return {
    schema:'rift-guidance-readability-001',typographicTolerancePx:0.5,
    root:elementRecord(root),title:textRecord(title),detail:textRecord(detail),
    word:{text:wordText,start:wordStart,end:wordStart+wordText.length,
      rects:wordRange.rects,bounds:wordRange.bounds,glyphs:glyphs},
    fonts:{root:style(root),title:style(title),detail:style(detail),toggle:style(toggle)},
    toggle:textRecord(toggle),toggleBeforeStyle:style(toggle,'::before'),
    row:elementRecord(row),slot:elementRecord(document.querySelector('#rift-guidance-slot')),
    objective:elementRecord(document.querySelector('#rift-objective')),
    arrow:textRecord(arrow),ancestors:ancestors,clippingAncestors:clippingAncestors,
    invisibleAncestors:invisibleAncestors,effectiveClip:effectiveClip,
    viewport:viewport,documentScroll:{x:scrollX,y:scrollY},
    visualViewport:window.visualViewport?{offsetLeft:visualViewport.offsetLeft,
      offsetTop:visualViewport.offsetTop,width:visualViewport.width,height:visualViewport.height,
      scale:visualViewport.scale}:null,
    fontStatus:document.fonts?document.fonts.status:null,
    fontFaces:document.fonts?Array.from(document.fonts).map(function(f){return {family:f.family,weight:f.weight,status:f.status};}):[]
  };
}

function assertGuidanceWord(measurement) {
  // Independent of (and never fed into) the existing 0.1px layout tolerance.
  const tolerance=0.5,fontTolerance=0.01;
  function fail(code,message,details) {
    const error=new Error(code+': '+message+(details?' '+JSON.stringify(details):''));
    error.code=code;error.details=details||null;throw error;
  }
  function positiveRect(value) {
    return value&&['left','top','right','bottom','width','height'].every(key=>Number.isFinite(value[key]))&&
      value.width>0&&value.height>0&&value.right>value.left&&value.bottom>value.top;
  }
  const m=measurement,word=m&&m.word;
  const match=m&&m.title&&/^\s*([A-Za-z]+(?:['\u2019-][A-Za-z]+)*)/.exec(m.title.text||'');
  if(!word||!match||!word.text||word.text!==match[1]||!Array.isArray(word.glyphs)||!word.glyphs.length)
    fail('guidance-leading-word-fragmented','an ordinary leading title word must exist');
  if(word.glyphs.map(glyph=>glyph.text).join('')!==word.text)
    fail('guidance-leading-word-fragmented','glyph ranges must cover the complete leading word',{word:word.text});
  if(!Array.isArray(word.rects)||!word.rects.length||!word.rects.every(positiveRect)||
    word.glyphs.some(glyph=>!Array.isArray(glyph.rects)||!glyph.rects.length||!glyph.rects.every(positiveRect)))
    fail('guidance-leading-word-fragmented','the complete leading word must have positive rendered ranges',{word:word.text});

  const lines=[];
  const allRects=word.rects.concat(...word.glyphs.map(glyph=>glyph.rects));
  for(const box of allRects) {
    if(!lines.some(line=>Math.abs(line.top-box.top)<=tolerance&&Math.abs(line.bottom-box.bottom)<=tolerance))
      lines.push({top:box.top,bottom:box.bottom});
  }
  if(lines.length!==1)
    fail('guidance-leading-word-fragmented','the complete leading word must remain on one line',
      {word:word.text,lineCount:lines.length,lines,typographicTolerancePx:tolerance});

  const fonts=m.fonts||{},rootSize=parseFloat(fonts.root&&fonts.root.fontSize),
    titleSize=parseFloat(fonts.title&&fonts.title.fontSize),detailSize=parseFloat(fonts.detail&&fonts.detail.fontSize),
    toggleSize=parseFloat(fonts.toggle&&fonts.toggle.fontSize);
  if(!Number.isFinite(rootSize)||rootSize<=0||!Number.isFinite(titleSize)||!Number.isFinite(detailSize)||!Number.isFinite(toggleSize)||
    Math.abs(titleSize-rootSize*0.875)>fontTolerance||Math.abs(detailSize-rootSize*0.75)>fontTolerance||Math.abs(toggleSize-rootSize*0.875)>fontTolerance)
    fail('guidance-font-size-changed','title/detail/toggle must retain 0.875/0.75/0.875 of the actual root font',
      {rootSize,titleSize,detailSize,toggleSize,fontTolerancePx:fontTolerance});
  if(!Array.isArray(m.invisibleAncestors)||m.invisibleAncestors.length)
    fail('guidance-leading-word-invisible','the title and its ancestors must be visible',
      {ancestors:m.invisibleAncestors||null});
  if(!m.viewport||!Array.isArray(m.clippingAncestors))
    fail('guidance-clip-measurement-missing','actual viewport and overflow clipping measurements are required');

  const clips=[{element:'viewport',clipsX:true,clipsY:true,client:m.viewport}].concat(m.clippingAncestors);
  const violations=[];
  for(const clip of clips) {
    const bounds=clip.client;
    if(!bounds||!['left','top','right','bottom'].every(key=>Number.isFinite(bounds[key])))
      fail('guidance-clip-measurement-missing','a clipping ancestor has no finite client bounds',{element:clip.element});
    for(const glyph of word.glyphs)for(const box of glyph.rects) {
      const edges=[];
      if(clip.clipsX&&box.left<bounds.left-tolerance)edges.push('left');
      if(clip.clipsX&&box.right>bounds.right+tolerance)edges.push('right');
      if(clip.clipsY&&box.top<bounds.top-tolerance)edges.push('top');
      if(clip.clipsY&&box.bottom>bounds.bottom+tolerance)edges.push('bottom');
      if(edges.length)violations.push({glyph:glyph.text,start:glyph.start,element:clip.element,edges,rect:box,client:bounds});
    }
  }
  if(violations.length)
    fail('guidance-leading-word-clipped','every leading-word glyph must fit inside actual clipping client bounds',
      {word:word.text,typographicTolerancePx:tolerance,violations});
  return {word:word.text,lineCount:lines.length,glyphCount:word.glyphs.length,
    rootFontSize:rootSize,titleFontSize:titleSize,detailFontSize:detailSize,toggleFontSize:toggleSize,
    clippingAncestorCount:m.clippingAncestors.length,typographicTolerancePx:tolerance};
}

module.exports={measureGuidanceWord,assertGuidanceWord};
