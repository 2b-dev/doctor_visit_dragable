// For discussion and comments, see: http://remysharp.com/2009/01/07/html5-enabling-script/
/*@cc_on'abbr article aside audio canvas details figcaption figure footer header hgroup mark menu meter nav output progress section summary time video'.replace(/\w+/g,function(n){document.createElement(n)})@*/

var addEvent = (function () {
  if (document.addEventListener) {
    return function (el, type, fn) {
      if ((el && el.nodeName) || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  } else {
    return function (el, type, fn) {
      if ((el && el.nodeName) || el === window) {
        el.attachEvent("on" + type, function () {
          return fn.call(el, window.event);
        });
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  }
})();

(function () {
  var pre = document.createElement("pre");
  pre.id = "view-source";

  // private scope to avoid conflicts with demos
  addEvent(window, "click", function (event) {
    if (event.target.hash == "#view-source") {
      // event.preventDefault();
      if (!document.getElementById("view-source")) {
        // pre.innerHTML = ('<!DOCTYPE html>\n<html>\n' + document.documentElement.innerHTML + '\n</html>').replace(/[<>]/g, function (m) { return {'<':'&lt;','>':'&gt;'}[m]});
        var xhr = new XMLHttpRequest();

        // original source - rather than rendered source
        xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            pre.innerHTML = this.responseText.replace(/[<>]/g, function (m) {
              return { "<": "&lt;", ">": "&gt;" }[m];
            });
            prettyPrint();
          }
        };

        document.body.appendChild(pre);
        // really need to be sync? - I like to think so
        xhr.open("GET", window.location, true);
        xhr.send();
      }
      document.body.className = "view-source";

      var sourceTimer = setInterval(function () {
        if (window.location.hash != "#view-source") {
          clearInterval(sourceTimer);
          document.body.className = "";
        }
      }, 200);
    }
  });
})();

//        var DEBUG = false;

var allowDragWithTwoFingersOnly = function (event) {
  // only allow drag with two fingers
  return event.touches.length === 2;
};

var threshold = 10;
var startX, startY;

var allowHorizontalDragOnly = function (event) {
  var touch = event.touches[0];

  if (startX === undefined || startY === undefined) {
    startX = touch.clientX;
    startY = touch.clientY;

    // we are uncertain if we shall start a drag operation.. return undefined
    return;
  }

  var deltaX = Math.abs(startX - touch.clientX),
    deltaY = Math.abs(startY - touch.clientY);

  console.log("startX: " + startX);
  console.log("startY: " + startY);

  console.log("deltaX: " + deltaX);
  console.log("deltaY: " + deltaY);

  if (deltaX > threshold || deltaY > threshold) {
    console.log("threshold reached.");

    // reset our initial values
    startX = undefined;
    startY = undefined;

    if (deltaX > deltaY) {
      console.log("horizontal drag detected, starting drag");
      // we know for sure to start it, return true
      return true;
    } else {
      console.log("vertical scroll detected, aborting drag");
      // we know for sure to abort it, return false
      return false;
    }
  }
};

var alertAction = function (event) {
  event.stopImmediatePropagation();
  event.preventDefault();
  alert("I'm your default action override");
  return true;
};

var urlParams = new URLSearchParams(window.location.search);
var holdToDrag = urlParams.get("holdToDrag");

var polyfillApplied = MobileDragDrop.polyfill({
  //            dragImageCenterOnTouch: true,
  //            dragImageOffset: {
  //                x: 0,
  //                y: 0
  //            },
  //            dragStartConditionOverride: allowHorizontalDragOnly,
  //            defaultActionOverride: alertAction,
  dragImageTranslateOverride:
    MobileDragDrop.scrollBehaviourDragImageTranslateOverride,
  holdToDrag: holdToDrag,
});

var innerBin = document.querySelector("#bin");

addEvent(innerBin, "dragenter", function (e) {
  //console.log("apperture dragenter");

  e.preventDefault();
  e.stopPropagation(); // stop it here to prevent it bubble up

  innerBin.classList.add("in");
});

addEvent(innerBin, "dragover", function (e) {
  //console.log("apperture dragover");

  e.preventDefault(); // allows us to drop
  e.stopPropagation(); // stop it here to prevent it bubble up

  e.dataTransfer.dropEffect = "copy";
});

addEvent(innerBin, "dragexit", function (e) {
  //console.log("apperture dragexit");

  e.stopPropagation(); // stop it here to prevent it bubble up

  innerBin.classList.remove("in");
});

addEvent(innerBin, "dragleave", function (e) {
  //console.log("apperture dragleave");

  e.stopPropagation(); // stop it here to prevent it bubble up

  innerBin.classList.remove("in");
});

addEvent(innerBin, "drop", function (e) {
  //console.log("apperture drop");

  e.stopPropagation(); // stop it here to prevent it bubble up

  innerBin.classList.remove("in");

  var el = document.getElementById(e.dataTransfer.getData("Text"));

  Swal.fire({
    title: "คุณแน่ใจหรือไม่ ?",
    text: "ว่าคุณต้องการลบการเข้าเยื่ยมนี้",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "ใช่ ตกลง",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.value) {
      el.parentNode.removeChild(el);
      Swal.fire({
        title: "ลบสำเร็จ",
        text: "คุณได้ทำการลบการเข้าเยี่ยมสำเร็จ.",
        icon: "success",
        confirmButtonText: "ปิด",
      });
    }
  });
});

var innerDrop = document.getElementsByClassName("canDrop"),
  dz = null;

for (var n = 0; n < innerDrop.length; n++) {
  dz = innerDrop[n];
  addEvent(dz, "dragenter", function (e) {
    //console.log("apperture dragenter");

    e.preventDefault();
    e.stopPropagation(); // stop it here to prevent it bubble up

    dz.classList.add("in");
  });

  addEvent(dz, "dragover", function (e) {
    //console.log("apperture dragover");

    e.preventDefault(); // allows us to drop
    e.stopPropagation(); // stop it here to prevent it bubble up

    e.dataTransfer.dropEffect = "copy";
  });

  addEvent(dz, "dragexit", function (e) {
    //console.log("apperture dragexit");

    e.stopPropagation(); // stop it here to prevent it bubble up

    dz.classList.remove("in");
  });

  addEvent(dz, "dragleave", function (e) {
    //console.log("apperture dragleave");

    e.stopPropagation(); // stop it here to prevent it bubble up

    dz.classList.remove("in");
  });

  addEvent(dz, "drop", function (e) {
    console.log("apperture drop");

    e.stopPropagation(); // stop it here to prevent it bubble up

    dz.classList.remove("in");

    var el = document.getElementById(e.dataTransfer.getData("Text"));

    Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: "ว่าคุณต้องการย้ายการเข้าเยื่ยมนี้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.value) {
        dz.appendChild(el);
        //alert(dz);
        el.parentNode.removeChild(el);
        Swal.fire({
          title: "ย้ายสำเร็จ",
          text: "คุณได้ทำการย้ายการเข้าเยี่ยมสำเร็จ.",
          icon: "success",
          confirmButtonText: "ปิด",
        });
      }
    });
  });
}

var links = document.getElementsByClassName("dragableCard"),
  el = null;
for (var i = 0; i < links.length; i++) {
  el = links[i];

  el.setAttribute("draggable", "true");

  addEvent(el, "dragstart", function (e) {
    console.log("dragstart");

    e.dataTransfer.effectAllowed = "copyLink";

    //TODO fails on desktop safari because drag is immediately aborted
    //                this.style.display = "none";

    //console.log("setting data: " + this.id);

    e.dataTransfer.setData("Text", this.id); // required otherwise doesn't work
  });

  addEvent(el, "drag", function (e) {
    //console.log("drag");
    innerBin.classList.add("show_bin");
  });

  addEvent(el, "dragend", function (e) {
    //                this.style.display = "block";
    //console.log("dragend with effect: " + e.dataTransfer.dropEffect);
    innerBin.classList.remove("show_bin");
  });

  addEvent(el, "click", function (e) {
    //console.log("clicked on draggable");
    //console.log("click offsetX, offsetY: " + e.offsetX + ", " + e.offsetY);
  });

  // Custom event fires only if holdToDrag is true
  addEvent(el, "dnd-poly-dragstart-pending", function (e) {
    console.log("dnd-poly-dragstart-pending");
    innerBin.classList.add("show_bin");
    e.preventDefault();
    e.stopPropagation(); // stop it here to prevent it bubble up
  });

  addEvent(el, "dnd-poly-dragstart-cancel", function (e) {
    console.log("dnd-poly-dragstart-cancel");
    innerBin.classList.remove("show_bin");
    e.preventDefault();
    e.stopPropagation(); // stop it here to prevent it bubble up
  });
}

try {
  window.addEventListener("touchmove", function () {}, { passive: false });
} catch (e) {}
