// const { func } = require('prop-types');
// const JSFiddle = require("..");

var data = [
  {
    x: [],
    y: [],
  },
];

var layout = {
  title: "Graph",
  showlegend: false,
  margin: {
    t: 0,
  },
  datarevision: 0,
  xaxis: {
    range: [-10, 10],
    showgrid: true,
    zeroline: true,
    showline: true,
    gridcolor: "#C0C0C0",
    gridwidth: 2,
    zerolinecolor: "#000000",
    zerolinewidth: 4,
    linecolor: "#808080",
    linewidth: 4,
  },
  yaxis: {
    range: [-10, 10],
    showgrid: true,
    zeroline: true,
    showline: true,
    gridcolor: "#C0C0C0",
    gridwidth: 2,
    zerolinecolor: "#000000",
    zerolinewidth: 4,
    linecolor: "#808080",
    linewidth: 4,
  },
  sliders: {
    visible: true,
    steps: [
      {
        label: "1",
        name: "ree",
        value: 5,
        x: 1,
      },
      {
        labe: "2",
        name: "raaa",
        value: 10,
        x: 0,
      },
    ],
  },
};

var config = {
  scrollZoom: true,
  editable: true,
  toImageButtonOptions: {
    format: "png", // one of png, svg, jpeg, webp
    filename: "custom_image",
    height: 1080,
    width: 1920,
    scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
  },
};

GRAPH = document.getElementById("graph");
SLIDER = {
  slider: {
    X: document.getElementById("sliderX"),
    Y: document.getElementById("sliderY"),
  },
  X: {
    minTag: document.getElementById("curMinX"),
    maxTag: document.getElementById("curMaxX"),
    minBTag: document.getElementById("minBX"),
    maxBTag: document.getElementById("maxBX"),
  },
  Y: {
    minTag: document.getElementById("curMinY"),
    maxTag: document.getElementById("curMaxY"),
    minBTag: document.getElementById("minBY"),
    maxBTag: document.getElementById("maxBY"),
  },
  Bound: {
    //Min/Max val of x/y
    minBY: 0,
    maxBY: 0,
    minBX: 0,
    maxBX: 0,
  },
  //layout.xaxis.range[0] and [1] stores x view bound
  //layout.yaxis.range[0] and [1] stores y view bound
};

SLIDER.slider.X.value = 0;
SLIDER.slider.X.min = parseInt(SLIDER.Bound.minBX);
SLIDER.slider.X.max = parseInt(SLIDER.Bound.maxBX);
SLIDER.X.minBTag.innerHTML = SLIDER.Bound.minBX.toFixed(2);
SLIDER.X.maxBTag.innerHTML = SLIDER.Bound.maxBX.toFixed(2);
SLIDER.X.minTag.innerHTML = layout.xaxis.range[0];
SLIDER.X.maxTag.innerHTML = layout.xaxis.range[1];

SLIDER.slider.Y.value = 0;
SLIDER.slider.Y.min = parseInt(SLIDER.Bound.minBY);
SLIDER.slider.Y.max = parseInt(SLIDER.Bound.maxBY);
SLIDER.Y.minBTag.innerHTML = SLIDER.Bound.minBY.toFixed(2);
SLIDER.Y.maxBTag.innerHTML = SLIDER.Bound.maxBY.toFixed(2);
SLIDER.Y.minTag.innerHTML = layout.yaxis.range[0];
SLIDER.Y.maxTag.innerHTML = layout.yaxis.range[1];

//addPointFromInput
function addPointFromInput() {
  let x = parseFloat(document.getElementById("xVal").value);
  let y = parseFloat(document.getElementById("yVal").value);

  addPoint(x, y);
}

function addPoint(x, y) {
  if (
    SLIDER.Bound.minBX == 0 &&
    SLIDER.Bound.minBX == 0 &&
    SLIDER.Bound.minBX == 0 &&
    SLIDER.Bound.minBX == 0 &&
    data[0].x.length == 0 &&
    data[0].y.length == 0
  ) {
    data[0].x.push(x);
    data[0].y.push(y);
    SLIDER.Bound.minBX = x;
    SLIDER.Bound.maxBX = x;
    SLIDER.Bound.minBY = y;
    SLIDER.Bound.maxBY = y;
    SLIDER.X.minBTag.innerHTML = x;
    SLIDER.X.maxBTag.innerHTML = x;
    SLIDER.Y.minBTag.innerHTML = y;
    SLIDER.Y.maxBTag.innerHTML = y;
    SLIDER.slider.X.min = x;
    SLIDER.slider.X.max = x;
    SLIDER.slider.Y.min = y;
    SLIDER.slider.Y.max = y;
    layout.datarevision++;
    centerGraph();
    return;
  }
  if (data[0].x.includes(x) && data[0].y.includes(y)) {
    return;
  } else {
    data[0].x.push(x);
    data[0].y.push(y);
    if (y < SLIDER.Bound.minBY) {
      SLIDER.Bound.minBY = y;
      SLIDER.Y.minBTag.innerHTML = y;
      SLIDER.slider.Y.min = y;
    }
    if (y > SLIDER.Bound.maxBY) {
      SLIDER.Bound.maxBY = y;
      SLIDER.Y.maxBTag.innerHTML = y;
      SLIDER.slider.Y.max = y;
    }
    if (x < SLIDER.Bound.minBX) {
      SLIDER.Bound.minBX = x;
      SLIDER.X.minBTag.innerHTML = x;
      SLIDER.slider.X.min = x;
    }
    if (x > SLIDER.Bound.maxBX) {
      SLIDER.Bound.maxBX = x;
      SLIDER.X.maxBTag.innerHTML = x;
      SLIDER.slider.X.max = x;
    }
    layout.datarevision++;
    centerGraph();
  }
}

function downloadGraph() {
  Plotly.downloadImage(GRAPH, data, layout, config);
}

//UPDATE BOUND -- UPDATE BOUND -- UPDATE BOUND -- UPDATE BOUND -- UPDATE BOUND
//update the bound of user's view on the graph.
function updateBound() {
  let minBoundY = parseInt(SLIDER.Bound.minBY);
  let maxBoundY = parseInt(SLIDER.Bound.maxBY);
  let minBoundX = parseInt(SLIDER.Bound.minBX);
  let maxBoundX = parseInt(SLIDER.Bound.maxBX);
  let tempMin, tempMax;
  let offset = 0;

  tempMin =
    parseInt(minBoundX) -
    parseInt(Math.min(400, (Math.abs(minBoundX) + 160) * 0.5));
  if (layout.xaxis.range[0] < tempMin) {
    //Reached bound
    offset = parseInt(tempMin) - parseInt(layout.xaxis.range[0]);
    layout.xaxis.range[0] = tempMin;
  }

  tempMax =
    parseInt(maxBoundX) +
    parseInt(Math.min(400, (Math.abs(maxBoundX) + 160) * 0.5));
  if (layout.xaxis.range[1] > tempMax) {
    //Reached bound
    if (offset == 0) {
      offset = parseInt(layout.xaxis.range[1]) - parseInt(tempMax);
      layout.xaxis.range[0] = Math.max(
        parseInt(layout.xaxis.range[0]) - parseInt(offset),
        tempMin
      );
    }
    layout.xaxis.range[1] = tempMax;
  } else {
    layout.xaxis.range[1] = Math.min(
      parseInt(layout.xaxis.range[1]) + parseInt(offset),
      tempMax
    );
  }

  offset = 0;
  tempMin =
    parseInt(minBoundY) -
    parseInt(Math.min(400, (Math.abs(minBoundY) + 160) * 0.5));
  if (layout.yaxis.range[0] < tempMin) {
    //Reached bound
    offset = parseInt(tempMin) - parseInt(layout.yaxis.range[0]);
    layout.yaxis.range[0] = tempMin;
  }

  tempMax =
    parseInt(maxBoundY) +
    parseInt(Math.min(400, (Math.abs(maxBoundY) + 160) * 0.5));
  if (layout.yaxis.range[1] > tempMax) {
    //Reached bound
    if (offset == 0) {
      offset = parseInt(layout.yaxis.range[1]) - parseInt(tempMax);
      layout.yaxis.range[0] = Math.max(
        parseInt(layout.yaxis.range[0]) - parseInt(offset),
        tempMin
      );
    }
    layout.yaxis.range[1] = tempMax;
  } else {
    layout.yaxis.range[1] = Math.min(
      parseInt(layout.yaxis.range[1]) + parseInt(offset),
      tempMax
    );
  }

  Plotly.react(GRAPH, data, layout, config);
  SLIDER.slider.X.value = (layout.xaxis.range[1] + layout.xaxis.range[0]) / 2;
  SLIDER.slider.Y.value = (layout.yaxis.range[1] + layout.yaxis.range[0]) / 2;
  updateXIndicator();
  updateYIndicator();
}

function centerGraph(sliderVal) {
  var xDimension = SLIDER.Bound.maxBX - SLIDER.Bound.minBX;
  var yDimension = SLIDER.Bound.maxBY - SLIDER.Bound.minBY;
  layout.xaxis.range[0] =
    SLIDER.Bound.minBX - Math.max(parseInt(xDimension * 0.2), 10);
  layout.xaxis.range[1] =
    SLIDER.Bound.maxBX + Math.max(parseInt(xDimension * 0.2), 10);
  layout.yaxis.range[0] =
    SLIDER.Bound.minBY - Math.max(parseInt(yDimension * 0.2), 10);
  layout.yaxis.range[1] =
    SLIDER.Bound.maxBY + Math.max(parseInt(yDimension * 0.2), 10);
  console.log(
    "Pre x min: " +
      layout.xaxis.range[0] +
      " center: " +
      +" max: " +
      layout.xaxis.range[1]
  );
  console.log(
    "Pre y min: " + layout.yaxis.range[0] + " max: " + layout.yaxis.range[1]
  );
  updateBound();
  console.log(
    "x min: " + layout.xaxis.range[0] + " max: " + layout.xaxis.range[1]
  );
  console.log(
    "y min: " + layout.yaxis.range[0] + " max: " + layout.yaxis.range[1]
  );
}

function updateXIndicator() {
  SLIDER.X.minTag.innerHTML = layout.xaxis.range[0].toFixed(2);
  SLIDER.X.maxTag.innerHTML = parseInt(layout.xaxis.range[1]).toFixed(2);
}

function updateYIndicator() {
  SLIDER.Y.minTag.innerHTML = layout.yaxis.range[0].toFixed(2);
  SLIDER.Y.maxTag.innerHTML = parseInt(layout.yaxis.range[1]).toFixed(2);
}

//relayout graph when slider's value modified
function xSliderUpdateGraph() {
  let tempWidth = layout.xaxis.range[1] - layout.xaxis.range[0];
  layout.xaxis.range[0] = parseInt(SLIDER.slider.X.value) - tempWidth / 2;
  layout.xaxis.range[1] =
    parseInt(SLIDER.slider.X.value) + parseInt(tempWidth / 2);
  updateBound();
}
function ySliderUpdateGraph() {
  let tempHeight = layout.yaxis.range[1] - layout.yaxis.range[0];
  layout.yaxis.range[0] = parseInt(SLIDER.slider.Y.value) - tempHeight / 2;
  layout.yaxis.range[1] =
    parseInt(SLIDER.slider.Y.value) + parseInt(tempHeight / 2);
  updateBound();
}

async function demonstrateAddPointFeature() {
  for (let i = 1; i < 2; i++) {
    for (let k = 1; k < 10; ) {
      var x = Math.floor(Math.random() * Math.pow(10, i));
      var y = Math.floor(Math.random() * Math.pow(10, i));
      addPoint(x, y);
    }
  }
}

var nextIndex = 0;
async function FindNextFromFile() {
  var pattern = "";

  var file = document.getElementById("file-select").files[0];
  if (!file) {
    return "404";
  }
  var navigator = new FileNavigator(file);
  var token = "initial token";

  await navigator.find(new RegExp(pattern), nextIndex, async function (
    err,
    index,
    match
  ) {
    nextIndex = index + 1; // search next after this one

    if (err) {
      return "EOF";
    }

    token = await match.line.substr(match.offset, match.length);
    token = await match.line.replace(token, token);
    var point = token.split(" ");
    var x = parseInt(point[0]);
    var y = parseInt(point[1]);
    addPoint(x, y);

    FindNextFromFile();
  });

  return token;
}

Plotly.react(GRAPH, data, layout, config);
GRAPH.on("plotly_relayout", updateBound);

/*DO NOT TOUCH --- DO NOT TOUCH --- DO NOT TOUCH --- DO NOT TOUCH --- DO NOT TOUCH*/

// by Anton Purin, 2015 MIT https://github.com/anpur/client-line-navigator
function LineNavigator(e, t, n) {
  function c(e, t) {
    var n = e.exec(t);
    return !n
      ? null
      : {
          offset: t.indexOf(n[0]),
          length: n[0].length,
          line: t,
        };
  }
  var r = this;
  if (typeof e != "function")
    throw "readChunk argument must be function(offset, length, callback)";
  if (typeof t != "function")
    throw "decode argument must be function(buffer, callback)";
  n = n ? n : {};
  var i = n.milestones ? n.milestones : [];
  var s = n.chunkSize ? n.chunkSize : 1024 * 4;
  var o = "\n".charCodeAt(0);
  var u = /\r?\n/;
  var a = function (e) {
    for (var t = i.length - 1; t >= 0; t--) {
      if (i[t].lastLine < e)
        return {
          firstLine: i[t].lastLine + 1,
          offset: i[t].offset + i[t].length,
        };
    }
    return {
      firstLine: 0,
      offset: 0,
    };
  };
  var f = function (e, t, n, r) {
    var u = i.length == 0 || i[i.length - 1].offset < t;
    var a = r - 1;
    var f = 0;
    for (var l = 0; l < n; l++) {
      if (e[l] == o) {
        a++;
        f = l + 1;
      }
    }
    if (a == r - 1) {
      f = n;
      a = r;
    } else if (n < s && n > f) {
      a++;
      f = n;
    }
    var c = {
      firstLine: r,
      lastLine: a,
      offset: t,
      length: f,
    };
    if (u) i.push(c);
    var h = Object.create(c);
    h.place = {
      firstLine: a + 1,
      offset: t + f,
    };
    return h;
  };
  var l = function (e, n, r) {
    t(e.slice(0, n), function (e) {
      var t = e.split(u);
      if (t.length > 0 && t[t.length - 1] == "") t = t.slice(0, t.length - 1);
      r(t);
    });
  };
  r.getMilestones = function () {
    return i;
  };
  r.readSomeLines = function (t, n) {
    var r = a(t);
    e(r.offset, s, function i(o, u, a) {
      if (o) return n(o, t);
      var c = a < s;
      var h = f(u, r.offset, a, r.firstLine);
      if (h.firstLine <= t && t <= h.lastLine) {
        l(u, h.length, function (e) {
          if (t != h.firstLine) e = e.splice(t - h.firstLine);
          n(undefined, t, e, c);
        });
      } else {
        if (c)
          return n(
            "Line " + t + " is out of index, last available: " + h.lastLine,
            t
          );
        r = h.place;
        e(r.offset, s, i);
      }
    });
  };
  r.readLines = function (e, t, n) {
    var i = [];
    r.readSomeLines(e, function s(o, u, a, f) {
      if (o) return n(o, e);
      i = i.concat(a);
      if (i.length >= t || f) return n(undefined, e, i.splice(0, t), f);
      r.readSomeLines(u + a.length, s);
    });
  };
  r.find = function (e, t, n) {
    r.readSomeLines(t, function i(t, s, o, u) {
      if (t) return n(t);
      for (var a = 0; a < o.length; a++) {
        var f = c(e, o[a]);
        if (f) return n(undefined, s + a, f);
      }
      if (u) return n(undefined);
      r.readSomeLines(s + o.length + 1, i);
    });
  };
  r.findAll = function (e, t, n, i) {
    var s = [];
    r.readSomeLines(t, function o(u, a, f, l) {
      if (u) return i(u, t);
      for (var h = 0; h < f.length; h++) {
        var p = c(e, f[h]);
        if (p) {
          p.index = a + h;
          s.push(p);
          if (s.length >= n) return i(undefined, t, true, s);
        }
      }
      if (l) return i(undefined, t, false, s);
      r.readSomeLines(a + f.length + 1, o);
    });
  };
}

function FileNavigator(e) {
  var n = this,
    r = e.size;
  e.navigator = this;
  var i = 0,
    t = function () {
      if (!r || 0 == r) return 0;
      var e = parseInt(100 * (i / r));
      return e > 100 ? 100 : e;
    },
    a = function (n, r, t) {
      i = n + r;
      var a = new FileReader();
      (a.onloadend = function (e) {
        var n;
        a.result && ((n = new Int8Array(a.result, 0)), (n.slice = n.subarray)),
          t(e.err, n, e.loaded);
      }),
        a.readAsArrayBuffer(e.slice(n, n + r));
    },
    o = function (e, n) {
      var r = new FileReader();
      (r.onloadend = function (e) {
        n(e.currentTarget.result);
      }),
        r.readAsText(new Blob([e]));
    },
    s = new LineNavigator(a, o, {
      chunkSize: 4194304,
    });
  (n.getMilestones = s.getMilestones),
    (n.readSomeLines = function (e, n) {
      s.readSomeLines(e, function (e, r, i, a) {
        n(e, r, i, a, t());
      });
    }),
    (n.readLines = function (e, n, r) {
      s.readLines(e, n, function (e, n, i, a) {
        r(e, n, i, a, t());
      });
    }),
    (n.find = s.find),
    (n.findAll = s.findAll),
    (n.getSize = function (n) {
      return n(e ? e.size : 0);
    });
}

/*DO NOT TOUCH --- DO NOT TOUCH --- DO NOT TOUCH --- DO NOT TOUCH --- DO NOT TOUCH*/

// demonstrateAddPointFeature();
