// function startAnimation() {
//   const letter = document.getElementById("text-page2");
//   const lines = letter.innerHTML.split("<br>");

//   letter.innerHTML = "";

//   let totalDelay = 0;

//   lines.forEach((line, lineIndex) => {
//     const words = line.trim().split(" ");

//     words.forEach((word, index) => {
//       const wordWrapper = document.createElement("span");
//       wordWrapper.textContent = word + (index === words.length - 1 ? "" : " ");
//       wordWrapper.style.opacity = 0;
//       letter.appendChild(wordWrapper);

//       gsap.to(wordWrapper, {
//         opacity: 1,
//         duration: 0.5,
//         delay: totalDelay + index * 0.1,
//       });
//     });

//     if (lineIndex < lines.length - 1) {
//       totalDelay += words.length * 0.1 + 0.5;
//       letter.appendChild(document.createElement("br"));
//     }
//   });
// }

function startAnimation() {
  const spans = document.querySelectorAll("#text-page2 span");

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

    if (currentPage > 6) {
      currentPage = 1;
    }
    if (currentPage === 2) {
      startAnimation();
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

var movingImage = document.getElementById("bicycle-wrapper");

var minLeft = 0;
var maxLeft = window.innerWidth - movingImage.offsetWidth - 250;

var paragraph = document.querySelector(".animate-paragraph");

var words = paragraph.textContent.split(" ");

paragraph.textContent = "";

words.forEach(function (word) {
  var span = document.createElement("span");
  span.textContent = word + " ";
  span.style.opacity = 0;
  paragraph.appendChild(span);
});

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

    var revealIndex = Math.floor(progress * words.length);

    for (var i = nextWordIndex; i <= revealIndex; i++) {
      gsap.to(paragraph.children[i], {
        opacity: 1,
        duration: 1,
      });
    }

    nextWordIndex = revealIndex + 1;

    document.body.classList.add("no-scroll");
  }
});

// Enable scrolling on the body when the mouse wheel interaction ends
movingImage.addEventListener("wheel", function () {
  document.body.classList.remove("no-scroll");
});
