import $ from "jquery";
import { gsap } from "gsap";

function hoverBtn() {
  $(".tp-hover-btn").on("mouseenter", function (e: JQuery.MouseEnterEvent) {
    const x = e.pageX - $(this).offset()!.left;
    const y = e.pageY - $(this).offset()!.top;

    $(this).find(".tp-btn-circle-dot").css({
      top: y,
      left: x,
    });
  });

  $(".tp-hover-btn").on("mouseout", function (e: JQuery.MouseLeaveEvent) {
    const x = e.pageX - $(this).offset()!.left;
    const y = e.pageY - $(this).offset()!.top;

    $(this).find(".tp-btn-circle-dot").css({
      top: y,
      left: x,
    });
  });

  const hoverBtns = gsap.utils.toArray<HTMLElement>(
    ".tp-hover-btn-wrapper"
  );

  const hoverBtnItems = gsap.utils.toArray<HTMLElement>(
    ".tp-hover-btn-item"
  );

  hoverBtns.forEach((btn, i) => {
    $(btn).on("mousemove", function (e) {
      callParallax(e);
    });

    function callParallax(e: JQuery.MouseMoveEvent) {
      parallaxIt(e, hoverBtnItems[i], 60);
    }

    function parallaxIt(
      e: JQuery.MouseMoveEvent,
      target: HTMLElement,
      movement: number
    ) {
      const $this = $(btn);

      const offset = $this.offset();
      if (!offset) return;

      const relX = e.pageX - offset.left;
      const relY = e.pageY - offset.top;

      const width = $this.width() || 1;
      const height = $this.height() || 1;

      gsap.to(target, {
        duration: 1,
        x: ((relX - width / 2) / width) * movement,
        y: ((relY - height / 2) / height) * movement,
        ease: "power2.out",
      });
    }

    $(btn).on("mouseleave", function () {
      gsap.to(hoverBtnItems[i], {
        duration: 1,
        x: 0,
        y: 0,
        ease: "power2.out",
      });
    });
  });
}

export { hoverBtn };