window.addEventListener('load', () => {
  const gttButton = document.querySelector(".goto-top");
  if (gttButton) {
    window.onscroll = () => {
      console.log([gttButton, document.body.scrollTop]);
    if (document.body.scrollTop > 300
    || document.documentElement.scrollTop > 300) {
            gttButton.classList.remove("opacity-0");
        } else {
            gttButton.classList.add("opacity-0");
        }
    };
  }
});
