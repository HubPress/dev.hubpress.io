const S = require('string');

function dasherize (value) {
  var s = value.trim().s.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-');
  return new S(s);
}

export default  (strValue) => {
  var sl = dasherize(new S(new S(strValue).latinise().s.replace(/[^\w\s-]/g, ''))).s;
  if (sl.charAt(0) === '-')
    sl = sl.substr(1);
  return (new S(sl)).s;
}
