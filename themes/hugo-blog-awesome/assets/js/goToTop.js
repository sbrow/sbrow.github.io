window.addEventListener('load', () => {
  const gttButton = document.querySelector(".goto-top");
  if (gttButton) {
    window.onscroll = () => {
    if (document.body.scrollTop > 300
    || document.documentElement.scrollTop > 300) {
            gttButton.classList.add("visible");
        } else {
            gttButton.classList.remove("visible");
        }
    };
  }
});
