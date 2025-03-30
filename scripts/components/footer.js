const addFooter = () => {
  let footer = document.createElement("div");
  footer.innerHTML = `<!-- Footer -->
<footer class="pt-2 text-center text-lg-start bg-body-tertiary text-muted border">
  

  <!-- Section: Links  -->
  <section class="">
    <div class="container text-center text-md-start mt-5">
      <!-- Grid row -->
      <div class="row mt-3">
        <!-- Grid column -->
        <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
          <!-- Content -->
          <h6 class="text-uppercase fw-bold mb-4">
            <i class="fas fa-gem me-3"></i>Skinology
          </h6>
          <p>
            We are commited to making the best possible phone skins for you, our customer and proud family member!
          </p>
        </div>
        <!-- Grid column -->

        <!-- Grid column -->
        <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
          <!-- Links -->
          <h6 class="text-uppercase fw-bold mb-4">
            Products
          </h6>
          <p>
            <a href="#!" class="text-reset">iPhone Skins</a>
          </p>
          <p>
            <a href="#!" class="text-reset">Samsung Skins</a>
          </p>
          <p>
            <a href="#!" class="text-reset">Google Skins</a>
          </p>
          <p>
            <a href="#!" class="text-reset">Other Skins</a>
          </p>
        </div>
        <!-- Grid column -->

        <!-- Grid column -->
        <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
          <!-- Links -->
          <h6 class="text-uppercase fw-bold mb-4">
            Navigation
          </h6>
          <p>
            <a href="#!" class="text-reset">About</a>
          </p>
          <p>
            <a href="#!" class="text-reset">Contact us</a>
          </p>
          <p>
            <a href="#!" class="text-reset">Member area</a>
          </p>
          <p>
            <a href="#!" class="text-reset">Shopping cart</a>
          </p>
          
        </div>
        <!-- Grid column -->

        <!-- Grid column -->
        <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
          <!-- Links -->
          <h6 class="text-uppercase fw-bold mb-4">Contact</h6>
          <p><i class="fas fa-home me-3"></i> Kaunas, Lithuania 49313</p>
          <p>
            <i class="fas fa-envelope me-3"></i>
            hello@skinology.com
          </p>
          <p><i class="fas fa-phone me-3"></i> + 01 234 567 88</p>
          <p><i class="fas fa-print me-3"></i> + 01 234 567 89</p>
        </div>
        <!-- Grid column -->
      </div>
      <!-- Grid row -->
    </div>
  </section>
  <!-- Section: Links  -->

  <!-- Copyright -->
  <div class="text-center border-top text-dark p-4 ">
    Skinology™ 2025  
  </div>
  <!-- Copyright -->
</footer>
<!-- Footer -->`;
  const lastElement = document.body.lastElementChild;
  console.log(lastElement);
  document.body.insertBefore(footer, lastElement);
};
addFooter();
