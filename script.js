(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var gnb = document.getElementById("gnb");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("scrolled", y > 10);
    toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeNav() {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "메뉴 열기");
  }
  navToggle.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  });
  gnb.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  var navLinks = Array.prototype.slice.call(gnb.querySelectorAll('a[href^="#"]'));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  var spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === id);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );
  sections.forEach(function (sec) {
    spy.observe(sec);
  });

  var revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = (i % 4) * 90 + "ms";
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  var statsBox = document.getElementById("heroStats");
  var counted = false;
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var duration = 1500;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("ko-KR");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || counted) return;
        counted = true;
        entry.target.querySelectorAll("[data-target]").forEach(animateCount);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  if (statsBox) statObserver.observe(statsBox);

  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var groups = {
    play: {
      cards: Array.prototype.slice.call(document.querySelectorAll("#playGrid > article")),
      empty: document.getElementById("playEmpty")
    },
    food: {
      cards: Array.prototype.slice.call(document.querySelectorAll("#foodGrid > article")),
      empty: document.getElementById("foodEmpty")
    }
  };

  function applyFilter(group) {
    var state = groups[group];
    var filter = document.querySelector('.chip[data-group="' + group + '"].active').getAttribute("data-filter");
    var visible = 0;
    state.cards.forEach(function (card) {
      var match = filter === "all" || card.getAttribute("data-cat") === filter;
      card.classList.toggle("hidden", !match);
      if (match) visible++;
    });
    state.empty.hidden = visible > 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var group = chip.getAttribute("data-group");
      chips.forEach(function (other) {
        if (other.getAttribute("data-group") === group) other.classList.remove("active");
      });
      chip.classList.add("active");
      applyFilter(group);
    });
  });

  var seasons = {
    spring: {
      title: "봄 · 새싹 갈대와 봄바람",
      desc: "겨울을 넘긴 갈대밭에 초록 새싹이 돋아나는 계절입니다. 강바람이 부드러워 산책과 자전거 타기에 가장 좋으며, 호수 둘레길에서 봄기운을 만날 수 있습니다.",
      points: [
        "얇은 겉옷 한 겹만 챙기면 산책하기 편해요",
        "자전거길 라이딩의 최적기입니다",
        "미세먼지 농도를 확인하고 방문하세요"
      ]
    },
    summer: {
      title: "여름 · 푸른 들판과 밤바람",
      desc: "갈대가 한참 자라 푸른 들판이 되는 계절입니다. 낮에는 시원한 에코센터 관람을, 해가 진 뒤에는 강변 밤산책과 시원한 치킨으로 하루를 마무리해 보세요.",
      points: [
        "자외선 차단제와 모자는 필수입니다",
        "여름철 갈대밭은 모기가 있으니 기피제를 챙기세요",
        "폭염 시간대를 피해 이른 아침·저녁 산책을 추천합니다"
      ]
    },
    autumn: {
      title: "가을 · 은빛 갈대의 계절",
      desc: "명지동의 가장 화려한 계절입니다. 갈대밭이 은빛 물결로 출렁이고, 후정호수에는 노을이 물듭니다. 사진 찍기 좋은 시즌이니 카메라는 필수입니다.",
      points: [
        "10월 중순~11월 초가 갈대의 절정입니다",
        "일몰 1시간 전 목교에 도착하면 최고의 뷰를 만날 수 있어요",
        "쌀쌀한 아침저녁에는 얇은 겉옷을 챙기세요"
      ]
    },
    winter: {
      title: "겨울 · 철새의 향연",
      desc: "낙동강 하구에 물오리·기러기 떼가 도래하는 계절입니다. 에코센터 관측대에서 탐조를 즐기고, 차가운 공기 속에서 따뜻한 식사로 몸을 녹이세요.",
      points: [
        "쌍안경·줌 카메라가 있으면 관찰이 두 배로 재미있어요",
        "강변은 바람이 강하니 방풍옷을 챙기세요",
        "이른 아침과 해질 무렵이 철새 관찰의 골든타임입니다"
      ]
    }
  };

  var seasonBtns = Array.prototype.slice.call(document.querySelectorAll(".season-btn"));
  var seasonTitle = document.getElementById("seasonTitle");
  var seasonDesc = document.getElementById("seasonDesc");
  var seasonPoints = document.getElementById("seasonPoints");
  var seasonPanel = document.getElementById("seasonPanel");

  function renderSeason(key) {
    var data = seasons[key];
    seasonTitle.textContent = data.title;
    seasonDesc.textContent = data.desc;
    seasonPoints.innerHTML = "";
    data.points.forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      seasonPoints.appendChild(li);
    });
    seasonPanel.style.animation = "none";
    void seasonPanel.offsetHeight;
    seasonPanel.style.animation = "seasonFade 0.45s ease";
  }

  seasonBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      seasonBtns.forEach(function (other) {
        other.classList.remove("active");
        other.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      renderSeason(btn.getAttribute("data-season"));
    });
  });

  if (!document.querySelector("style[data-season-fade]")) {
    var fadeStyle = document.createElement("style");
    fadeStyle.setAttribute("data-season-fade", "");
    fadeStyle.textContent = "@keyframes seasonFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}";
    document.head.appendChild(fadeStyle);
  }

  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
