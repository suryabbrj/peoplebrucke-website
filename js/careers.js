(function () {
  'use strict';

  const form = document.getElementById('careers-form');
  if (!form) return;

  const statusEl = document.getElementById('careers-form-status');
  const statusMessageEl = document.getElementById('careers-form-status-message');
  const submitAnotherBtn = document.getElementById('careers-submit-another');
  const submitBtn = document.getElementById('careers-submit');
  const submitText = submitBtn.querySelector('.careers-form__submit-text');
  const submitLoading = submitBtn.querySelector('.careers-form__submit-loading');
  const resumeInput = document.getElementById('resume');
  const dropzone = document.getElementById('resume-dropzone');
  const fileNameEl = document.getElementById('resume-file-name');


  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const ALLOWED_EXT = ['.pdf', '.doc', '.docx'];

  function setStatus(message, type, options = {}) {
    statusEl.hidden = false;
    if (statusMessageEl) statusMessageEl.textContent = message;
    statusEl.className = `careers-form__status careers-form__status--${type}`;
    if (submitAnotherBtn) {
      submitAnotherBtn.hidden = !options.showSubmitAnother;
    }
  }

  function clearStatus() {
    statusEl.hidden = true;
    if (statusMessageEl) statusMessageEl.textContent = '';
    statusEl.className = 'careers-form__status';
    if (submitAnotherBtn) submitAnotherBtn.hidden = true;
  }

  function resetFormForAnother() {
    form.classList.remove('careers-form--submitted');
    clearStatus();
    clearErrors();
    form.reset();
    updateFileDisplay(null);

    const firstField = form.querySelector('#firstName');
    if (firstField) firstField.focus();
  }

  function setFieldError(name, message) {
    const input = form.elements[name];
    const errorEl = form.querySelector(`[data-error-for="${name}"]`);
    if (input) input.classList.toggle('careers-form__input--error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  function clearErrors() {
    form.querySelectorAll('[data-error-for]').forEach((el) => {
      el.textContent = '';
    });
    form.querySelectorAll('.careers-form__input--error').forEach((el) => {
      el.classList.remove('careers-form__input--error');
    });
  }

  function getFileExtension(name) {
    const i = name.lastIndexOf('.');
    return i >= 0 ? name.slice(i).toLowerCase() : '';
  }

  function validateFile(file) {
    if (!file) return 'Please upload your resume.';
    if (file.size > MAX_FILE_SIZE) return 'Resume must be 5 MB or smaller.';
    const ext = getFileExtension(file.name);
    if (!ALLOWED_EXT.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      return 'Resume must be a PDF, DOC, or DOCX file.';
    }
    return '';
  }

  function updateFileDisplay(file) {
    if (file) {
      dropzone.classList.add('careers-form__dropzone--has-file');
      fileNameEl.hidden = false;
      fileNameEl.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    } else {
      dropzone.classList.remove('careers-form__dropzone--has-file');
      fileNameEl.hidden = true;
      fileNameEl.textContent = '';
    }
  }

  function validateForm() {
    clearErrors();
    let valid = true;

    const required = ['firstName', 'lastName', 'email', 'phoneCode', 'phone', 'city', 'country', 'nationality', 'designation', 'area', 'experience'];
    required.forEach((name) => {
      const el = form.elements[name];
      const value = el && el.value ? el.value.trim() : '';
      if (!value) {
        setFieldError(name, 'This field is required.');
        valid = false;
      }
    });



    const email = form.elements.email.value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('email', 'Please enter a valid email address.');
      valid = false;
    }

    const linkedin = form.elements.linkedin.value.trim();
    if (linkedin) {
      try {
        const url = new URL(linkedin);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      } catch {
        setFieldError('linkedin', 'Please enter a valid URL.');
        valid = false;
      }
    }

    const resumeError = validateFile(resumeInput.files[0]);
    if (resumeError) {
      setFieldError('resume', resumeError);
      valid = false;
    }

    if (!form.elements.consent.checked) {
      setFieldError('consent', 'You must consent to continue.');
      valid = false;
    }

    return valid;
  }

  function setSubmitting(loading) {
    submitBtn.disabled = loading;
    submitText.hidden = loading;
    submitLoading.hidden = !loading;
  }

  resumeInput.addEventListener('change', () => {
    setFieldError('resume', '');
    updateFileDisplay(resumeInput.files[0] || null);
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('careers-form__dropzone--dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('careers-form__dropzone--dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('careers-form__dropzone--dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
      const dt = new DataTransfer();
      dt.items.add(file);
      resumeInput.files = dt.files;
      updateFileDisplay(file);
      setFieldError('resume', '');
    }
  });

  if (submitAnotherBtn) {
    submitAnotherBtn.addEventListener('click', resetFormForAnother);
  }

  function initCombobox(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;

    const originalOptions = Array.from(dropdown.querySelectorAll('.combobox-option')).map(opt => opt.getAttribute('data-value'));
    let focusedIndex = -1;

    function renderOptions(filterText) {
      dropdown.innerHTML = '';
      const text = filterText.trim().toLowerCase();
      let matches = [];

      originalOptions.forEach(optVal => {
        if (!text || optVal.toLowerCase().includes(text)) {
          matches.push(optVal);
        }
      });

      // Render standard matching options
      matches.forEach(optVal => {
        const div = document.createElement('div');
        div.className = 'combobox-option';
        div.setAttribute('data-value', optVal);
        div.textContent = optVal;
        dropdown.appendChild(div);
      });

      // If user typed something not matching exactly, and not empty, show "Use custom" option
      const hasExactMatch = originalOptions.some(optVal => optVal.toLowerCase() === text);
      if (text && !hasExactMatch) {
        const customDiv = document.createElement('div');
        customDiv.className = 'combobox-option custom-option';
        customDiv.setAttribute('data-value', filterText.trim());
        customDiv.textContent = `Use custom: "${filterText.trim()}"`;
        dropdown.appendChild(customDiv);
      }

      const visibleOptions = dropdown.querySelectorAll('.combobox-option');
      dropdown.hidden = visibleOptions.length === 0;
      focusedIndex = -1;
    }

    function selectOption(value) {
      input.value = value;
      dropdown.hidden = true;
      focusedIndex = -1;
      setFieldError(inputId, ''); // Clear errors when selection happens
    }

    function moveFocus(direction) {
      const options = dropdown.querySelectorAll('.combobox-option');
      if (options.length === 0) return;

      if (focusedIndex >= 0 && focusedIndex < options.length) {
        options[focusedIndex].classList.remove('focused');
      }

      if (direction === 'down') {
        focusedIndex = (focusedIndex + 1) % options.length;
      } else {
        focusedIndex = (focusedIndex - 1 + options.length) % options.length;
      }

      const activeOpt = options[focusedIndex];
      activeOpt.classList.add('focused');
      activeOpt.scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('focus', () => {
      renderOptions(input.value);
    });

    input.addEventListener('input', () => {
      renderOptions(input.value);
    });

    input.addEventListener('keydown', (e) => {
      if (dropdown.hidden) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          renderOptions(input.value);
          e.preventDefault();
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveFocus('down');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveFocus('up');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const options = dropdown.querySelectorAll('.combobox-option');
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          selectOption(options[focusedIndex].getAttribute('data-value'));
        }
      } else if (e.key === 'Escape') {
        dropdown.hidden = true;
        focusedIndex = -1;
      }
    });

    // Handle clicking options
    dropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.combobox-option');
      if (option) {
        selectOption(option.getAttribute('data-value'));
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.hidden = true;
        focusedIndex = -1;
      }
    });

    // Close on blur (delayed to allow clicks)
    input.addEventListener('blur', () => {
      setTimeout(() => {
        dropdown.hidden = true;
        focusedIndex = -1;
      }, 200);
    });
  }

  // Initialize both autocomplete comboboxes
  initCombobox('area', 'area-dropdown');
  initCombobox('designation', 'designation-dropdown');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearStatus();

    if (!validateForm()) {
      setStatus('Please fix the errors below and try again.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        body: new FormData(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      form.classList.add('careers-form--submitted');
      setStatus('Thank you — your application has been received. We will be in touch soon.', 'success', {
        showSubmitAnother: true,
      });
      form.reset();
      updateFileDisplay(null);
    } catch (err) {
      setStatus(err.message || 'Unable to submit your application. Please try again later.', 'error');
    } finally {
      setSubmitting(false);
    }
  });
})();
