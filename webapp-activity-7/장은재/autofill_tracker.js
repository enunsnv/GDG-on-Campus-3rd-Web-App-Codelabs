// autofill_tracker.js
const formId = 'myForm'; // Replace with your form's ID
const fieldsToTrack = ['name', 'email', 'address', 'city', 'zip']; // Replace with your field IDs

const autofillStatuses = {};

function initializeAutofillTracking() {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID '${formId}' not found.`);
        return;
    }

    fieldsToTrack.forEach(fieldId => {
        const field = form.querySelector(`#${fieldId}`);
        if (!field) {
          console.warn(`Field with ID '${fieldId}' not found in the form.`);
          return;
        }

        autofillStatuses[fieldId] = 'EMPTY';
        field.addEventListener('change', (event) => {
            const fieldElement = event.target;
            if (fieldElement.matches(':autofill')) {
                if (autofillStatuses[fieldId] === 'EMPTY'){
                  autofillStatuses[fieldId] = 'AUTOFILLED';
                } else if(autofillStatuses[fieldId] === 'ONLY_MANUAL'){
                    autofillStatuses[fieldId] = 'ONLY_MANUAL_THEN_AUTOFILLED';
                } else if (autofillStatuses[fieldId] === 'AUTOFILLED_THEN_MODIFIED'){
                    // keep the status
                } else {
                    autofillStatuses[fieldId] = 'AUTOFILLED';
                }
            } else {
                if (autofillStatuses[fieldId] === 'AUTOFILLED'){
                    autofillStatuses[fieldId] = 'AUTOFILLED_THEN_MODIFIED';
                } else if (autofillStatuses[fieldId] === 'ONLY_MANUAL_THEN_AUTOFILLED') {
                  autofillStatuses[fieldId] = 'ONLY_MANUAL';
                }else{
                    autofillStatuses[fieldId] = 'ONLY_MANUAL';
                }
            }
        });
    });

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const formElement = event.target;
      const formId = formElement.dataset.formId;
      fieldsToTrack.forEach(fieldId => {
        gtag('event', 'autofill_form_interaction', {
          'form_id': formId,
          'field_id': fieldId,
          'autofill_status': autofillStatuses[fieldId]
        });
      });
      formElement.submit();
    });
}

document.addEventListener('DOMContentLoaded', initializeAutofillTracking);