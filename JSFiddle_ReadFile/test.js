// by Anton Purin, 2015 MIT https://github.com/anpur/client-line-navigator
function LineNavigator(e, t, n) {
    function c(e, t) {
      var n = e.exec(t);
      return !n ? null : {
        offset: t.indexOf(n[0]),
        length: n[0].length,
        line: t
      }
    }
    var r = this;
    if (typeof e != "function") throw "readChunk argument must be function(offset, length, callback)";
    if (typeof t != "function") throw "decode argument must be function(buffer, callback)";
    n = n ? n : {};
    var i = n.milestones ? n.milestones : [];
    var s = n.chunkSize ? n.chunkSize : 1024 * 4;
    var o = "\n".charCodeAt(0);
    var u = /\r?\n/;
    var a = function(e) {
      for (var t = i.length - 1; t >= 0; t--) {
        if (i[t].lastLine < e) return {
          firstLine: i[t].lastLine + 1,
          offset: i[t].offset + i[t].length
        }
      }
      return {
        firstLine: 0,
        offset: 0
      }
    };
    var f = function(e, t, n, r) {
      var u = i.length == 0 || i[i.length - 1].offset < t;
      var a = r - 1;
      var f = 0;
      for (var l = 0; l < n; l++) {
        if (e[l] == o) {
          a++;
          f = l + 1
        }
      }
      if (a == r - 1) {
        f = n;
        a = r
      } else if (n < s && n > f) {
        a++;
        f = n
      }
      var c = {
        firstLine: r,
        lastLine: a,
        offset: t,
        length: f
      };
      if (u) i.push(c);
      var h = Object.create(c);
      h.place = {
        firstLine: a + 1,
        offset: t + f
      };
      return h
    };
    var l = function(e, n, r) {
      t(e.slice(0, n), function(e) {
        var t = e.split(u);
        if (t.length > 0 && t[t.length - 1] == "") t = t.slice(0, t.length - 1);
        r(t)
      })
    };
    r.getMilestones = function() {
      return i
    };
    r.readSomeLines = function(t, n) {
      var r = a(t);
      e(r.offset, s, function i(o, u, a) {
        if (o) return n(o, t);
        var c = a < s;
        var h = f(u, r.offset, a, r.firstLine);
        if (h.firstLine <= t && t <= h.lastLine) {
          l(u, h.length, function(e) {
            if (t != h.firstLine) e = e.splice(t - h.firstLine);
            n(undefined, t, e, c)
          })
        } else {
          if (c) return n("Line " + t + " is out of index, last available: " + h.lastLine, t);
          r = h.place;
          e(r.offset, s, i)
        }
      })
    };
    r.readLines = function(e, t, n) {
      var i = [];
      r.readSomeLines(e, function s(o, u, a, f) {
        if (o) return n(o, e);
        i = i.concat(a);
        if (i.length >= t || f) return n(undefined, e, i.splice(0, t), f);
        r.readSomeLines(u + a.length, s)
      })
    };
    r.find = function(e, t, n) {
      r.readSomeLines(t, function i(t, s, o, u) {
        if (t) return n(t);
        for (var a = 0; a < o.length; a++) {
          var f = c(e, o[a]);
          if (f) return n(undefined, s + a, f)
        }
        if (u) return n(undefined);
        r.readSomeLines(s + o.length + 1, i)
      })
    };
    r.findAll = function(e, t, n, i) {
      var s = [];
      r.readSomeLines(t, function o(u, a, f, l) {
        if (u) return i(u, t);
        for (var h = 0; h < f.length; h++) {
          var p = c(e, f[h]);
          if (p) {
            p.index = a + h;
            s.push(p);
            if (s.length >= n) return i(undefined, t, true, s)
          }
        }
        if (l) return i(undefined, t, false, s);
        r.readSomeLines(a + f.length + 1, o)
      })
    }
  }
  
  function FileNavigator(e) {
    var n = this,
      r = e.size;
    e.navigator = this;
    var i = 0,
      t = function() {
        if (!r || 0 == r) return 0;
        var e = parseInt(100 * (i / r));
        return e > 100 ? 100 : e
      },
      a = function(n, r, t) {
        i = n + r;
        var a = new FileReader;
        a.onloadend = function(e) {
          var n;
          a.result && (n = new Int8Array(a.result, 0), n.slice = n.subarray), t(e.err, n, e.loaded)
        }, a.readAsArrayBuffer(e.slice(n, n + r))
      },
      o = function(e, n) {
        var r = new FileReader;
        r.onloadend = function(e) {
          n(e.currentTarget.result)
        }, r.readAsText(new Blob([e]))
      },
      s = new LineNavigator(a, o, {
        chunkSize: 4194304
      });
    n.getMilestones = s.getMilestones, n.readSomeLines = function(e, n) {
      s.readSomeLines(e, function(e, r, i, a) {
        n(e, r, i, a, t())
      })
    }, n.readLines = function(e, n, r) {
      s.readLines(e, n, function(e, n, i, a) {
        r(e, n, i, a, t())
      })
    }, n.find = s.find, n.findAll = s.findAll, n.getSize = function(n) {
      return n(e ? e.size : 0)
    }
  }
  
  var started, finished;
  
  function InitDemo(title) {
    $('#meta').html('');
    $('#output').html('');
  
    // if ($('#file-select')[0].files.length == 0 || $('#file-select')[0].files[0] == null) {
    //   $('#meta').html('Please, choose file!');
    //   return null;
    // }
  
    var file = $('#file-select')[0].files[0];
  
    // $('#meta').append(title + '<br>');
    // $('#meta').append($('#file-select')[0].files[0].name + ' ' + (Math.round((file.size / 1024 / 1024) * 100) / 100) + ' MB<br>');
  
    started = new Date();
    finished = null;
  
    return file;
  }
  
//   function DemoFinished(metaInfo, results) {
//     $('#meta').append('Time spent: ' + (finished - started) + 'ms.' + (metaInfo ? '<br>' + metaInfo : ''));
//     $('#output').html(results ? results : 'NO RESULTS');
//   }

  var nextIndex = 0;

  // function FindNext() {
  //   var pattern = "";
  
  //   var file = InitDemo('Find of "' + pattern + '" pattern starting from ' + nextIndex);
  //   if (!file) return;
  
  //   var navigator = new FileNavigator(file);
  
  //   navigator.find(new RegExp(pattern), nextIndex, function(err, index, match) {
  //     finished = new Date();
  //     nextIndex = index + 1; // search next after this one
  
  //     if (err) {
  //       // DemoFinished('Error: ' + err);
  //       return false;
  //     }
  //   //   if (!match) {
  //       // DemoFinished('No matching lines found');
  //       // return;
  //   //   }
  
  //     var token = match.line.substr(match.offset, match.length);
  //     console.log(match.line.replace(token, token));
  //   //   DemoFinished('Found matching token on ' + index + ' line', index + ': ' + match.line.replace(token, '<mark>' + token + '</mark>'));
  //   });
  //   return true;
  // }
  // $('#search-next').click(function() {
  //   FindNext();
  // });
  
  