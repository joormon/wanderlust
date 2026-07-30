
// Wait for the DOM elements to load completely
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Select all your delete forms or buttons
    const deleteForms = document.querySelectorAll(".delete-form");

    // 2. Attach a submit event listener to each form
    deleteForms.forEach(form => {
        form.addEventListener("submit", (event) => {
            
            // 3. Trigger the native confirmation pop-up window
            const confirmDelete = confirm("Are you sure you want to delete this chat permanently?");
            
            // 4. If the user clicks 'Cancel', stop the form from sending the request to Express
            if (!confirmDelete) {
                event.preventDefault(); 
            }
        });
    });
});


// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()