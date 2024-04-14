function unmuteAudio() {
  var audio = document.getElementById("page3-audio");
  audio.muted = false;
}

function muteAudio() {
  var audio = document.getElementById("page3-audio");
  audio.muted = true;
}

var movingImage = document.getElementById("bicycle-wrapper");

const spans2 = document.querySelectorAll(".animate-paragraph span");
spans2.forEach(function (span) {
  span.style.opacity = 0;
});

function startAnimationPage2() {
  const spans = document.querySelectorAll("#animate-text-page2 span");

  gsap
    .timeline({ defaults: { ease: "power2.inOut" } })
    .fromTo(
      spans,
      { opacity: 0, y: "10%" },
      { opacity: 1, y: "0%", duration: 0.5, stagger: 0.1 }
    );
}

function startAnimationPage6() {
  const spans = document.querySelectorAll("#animate-text-page6 span");

  gsap
    .timeline({ defaults: { ease: "power2.inOut" } })
    .fromTo(
      spans,
      { opacity: 0, y: "10%" },
      { opacity: 1, y: "0%", duration: 0.5, stagger: 0.1 }
    );
}

let currentPage = 1;

document.querySelectorAll(".nextButton").forEach((button) => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".main-cursor").forEach((element) => {
      if (currentPage === 3) {
        element.style.display = "none";
      } else {
        element.style.display = "inherit";
      }
    });
    currentPage++;

    if (currentPage > 7) {
      currentPage = 1;
    }
    if (currentPage === 2) {
      startAnimationPage2();
    }
    if (currentPage === 6) {
      startAnimationPage6();
    }
    if (currentPage === 3) {
      unmuteAudio();
    } else {
      muteAudio();
    }
    if (currentPage === 1) {
      nextWordIndex = 0;
      movingImage.style.removeProperty("left");
      spans2.forEach(function (span) {
        span.style.opacity = 0;
      });
    }
    showPage(currentPage);
  });
});

function showPage(pageNumber) {
  document.querySelectorAll(".page").forEach((page) => {
    page.style.display = "none";
  });
  document.getElementById(`page${pageNumber}`).style.display = "flex";
}

const trails = document.querySelectorAll(".trail");
const smoothPointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};
const totalPointsArray = [40, 35, 30, 25, 20, 15, 10];

window.addEventListener("mousemove", (event) => {
  gsap.to(smoothPointer, {
    x: event.clientX,
    y: event.clientY,
    duration: 0.5,
    ease: "power2.out",
  });
});

function updatePath() {
  trails.forEach((path, index) => {
    let points = path.points || [];
    points.unshift({ ...smoothPointer });
    while (points.length > totalPointsArray[index]) {
      points.pop();
    }
    path.points = points;

    if (points.length > 1) {
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i].x} ${points[i].y}`;
      }
      path.setAttribute("d", d);
    }
  });

  requestAnimationFrame(updatePath);
}

updatePath();

const itemsArray = [];
const cursor = document.querySelector(".cursor");

document.addEventListener("click", function (event) {
  if (currentPage === 2) {
    const clickSound = new Audio("./assets/click-sfx.mp3");
    clickSound.play();
  }

  let container = document.createElement("div");
  let elementWidth = 700;

  const imgNumber = Math.floor(Math.random() * 6) + 1;
  container.innerHTML = `<div class="img-container">
                                 <img src="./assets/img-${imgNumber}.jpg" alt="" />
                               </div>`;

  const appendedElement = container.firstChild;
  document.querySelector(".items-container").appendChild(appendedElement);

  appendedElement.style.left = `${event.clientX - elementWidth / 2}px`;
  appendedElement.style.top = `${event.clientY}px`;
  const randomRotation = Math.random() * 10 - 5;

  gsap.set(appendedElement, {
    scale: 0,
    rotation: randomRotation,
    transformOrigin: "center",
  });

  const tl = gsap.timeline();

  const randomScale = Math.random() * 0.5 + 0.5;
  tl.to(appendedElement, {
    scale: randomScale,
    duration: 0.5,
    delay: 0.1,
  });

  tl.to(
    appendedElement,
    {
      y: () => `-=500`,
      opacity: 1,
      duration: 4,
      ease: "none",
    },
    "<"
  ).to(
    appendedElement,
    {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        appendedElement.parentNode.removeChild(appendedElement);
      },
    },
    "-=0.5"
  );
});

let mouseX = 0;
let mouseY = 0;
let flashlight = document.getElementById("flashlight");

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};

function getMousePosition(e) {
  mouseX = !isTouchDevice() ? e.pageX : e.touches[0].pageX;
  mouseY = !isTouchDevice() ? e.pageY : e.touches[0].pageY;

  flashlight.style.setProperty("--Xpos", mouseX + "px");
  flashlight.style.setProperty("--Ypos", mouseY + "px");
}

document.addEventListener("mousemove", getMousePosition);
document.addEventListener("touchmove", getMousePosition);

var minLeft = 0;
var maxLeft = window.innerWidth - movingImage.offsetWidth - 250;

var nextWordIndex = 0;

window.addEventListener("wheel", function (event) {
  if (currentPage === 3) {
    event.preventDefault();

    var deltaY = event.deltaY;

    var currentLeft = parseFloat(
      window.getComputedStyle(movingImage).getPropertyValue("left")
    );
    var newLeft = currentLeft + deltaY;

    newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));

    gsap.to(movingImage, { left: newLeft, duration: 2, ease: "power2.out" });

    var progress = (newLeft - minLeft) / (maxLeft - minLeft);

    var revealIndex = Math.floor(progress * spans2.length);

    for (var i = nextWordIndex; i <= revealIndex; i++) {
      gsap.to(spans2[i], {
        opacity: 1,
        duration: 1,
      });
    }

    nextWordIndex = revealIndex + 1;
  }
});
