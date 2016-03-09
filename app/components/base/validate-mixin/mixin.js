import ReactDOM from 'react-dom';

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);


/* eslint no-param-reassign: [2, { "props": false }] */
function validatorRun(validator, errors, eventName, fieldName, fieldValue, field, refs) {
  const validateResult = validator.apply(
    this,
    [
      {
        validateEvent: 'all',
        eventName,
        fieldName,
        fieldValue,
        field,
        refs
      }, false
    ]);

  if (validateResult) {
    errors[fieldName] = validateResult;
    return false;
  }
  delete errors[fieldName];
  return true;
}

const convertersHelpers = {
  int(data) {
    return parseInt(data.value, 10);
  },

  setFloat(data) {
    const value = data.value.replace(/\,/g, '.');
    return parseFloat(value);
  }
};

const validatorsHelpers = {
  required(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---
      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      if (data.fieldValue) {
        return false;
      }
      if (fData.errorMsg) {
        return fData.errorMsg;
      }
      return capitalizeFirstLetter('${data.fieldName} field is required');
      // ---
    }
    // --- Return func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  },

  num(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---
      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      if (isNaN(data.fieldValue)) {
        if (fData.errorMsg) {
          return fData.errorMsg;
        }
        return `${capitalizeFirstLetter(name)} must be a number`;
      }
      return false;
    }
    // --- Return func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  },

  intRange(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---
      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      const value = parseInt(data.fieldValue, 10);
      if (fData.from > value || fData.to < value) {
        if (fData.errorMsg) {
          return fData.errorMsg;
        }
        return '${capitalizeFirstLetter(data.fieldName)}' +
          'must be in range from ${fData.from} to ${fData.to}';
      }
      return false;
      // ---
    }
    // --- Return func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  },

  isFloat(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---
      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      const value = data.fieldValue.replace(/\,/g, '.');
      if (value && !isNaN(parseFloat(value))) {
        return false;
      }
      if (fData.errorMsg) {
        return fData.errorMsg;
      }
      return capitalizeFirstLetter('${data.fieldName} must be a valid');
      // ---
    }
    // --- Return func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  },

  email(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---

      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      const re = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-line max-len
      if (re.test(data.fieldValue)) {
        return false;
      }
      if (fData.errorMsg) {
        return fData.errorMsg;
      }
      return '${capitalizeFirstLetter(data.fieldName)} must be a valid';
      // ---
    }
    // --- Return func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  },

  minLenght(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---

      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      if (data.fieldValue && data.fieldValue.length >= fData.min) {
        return false;
      }
      if (fData.errorMsg) {
        return fData.errorMsg;
      }
      return '${capitalizeFirstLetter(name)} must be at least ${fData.min} characters';
      // ---
    }
    // --- Retur func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  },

  minInt(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---

      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      if (parseInt(data.fieldValue, 10) >= fData.min) {
        return false;
      }
      if (fData.errorMsg) {
        return fData.errorMsg;
      }
      return '${capitalizeFirstLetter(name)} must be minimum ${fData.min}';
      // ---
    }
    // --- Retur func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  },

  maxInt(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---

      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      if (parseInt(data.fieldValue, 10) <= fData.max) {
        return false;
      }
      if (fData.errorMsg) {
        return fData.errorMsg;
      }
      return '${capitalizeFirstLetter(data.fieldName)} must be maximum ${fData.max}';
      // ---
    }
    // --- Retur func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  },

  equal(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---

      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      if (data.fieldValue === fData.value) {
        return false;
      }
      if (fData.errorMsg) {
        return fData.errorMsg;
      }
      return '${capitalizeFirstLetter(name)} must be equal ${fData.value}';
      // ---
    }
    // --- Retur func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  },


  equalField(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---
      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      const equalField = ReactDOM.findDOMNode(data.refs[fData.field]);
      let equalFieldValue = equalField.value;
      if (equalField.type === 'checkbox') {
        equalFieldValue = equalField.checked;
      } else if (equalField.type === 'radio') {
        for (const radio of equalField.form.querySelectorAll(`input[name=${equalField.name}]`)) {
          if (radio.checked) {
            equalFieldValue = radio.value;
            break;
          }
        }
      }

      if (data.fieldValue === equalFieldValue) {
        return false;
      }
      if (fData.errorMsg) {
        return fData.errorMsg;
      }
      return '${capitalizeFirstLetter(data.fieldName)} must be equal with ${fData.field}';

      // ---
    }
    // --- Return func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  },

  url(fData, funcReturn = true) {
    function returnFunc(data) {
      // --- Event check ---

      if (typeof fData.validateEvent === 'undefined') {
        fData.validateEvent = 'all';
      }
      if (fData.validateEvent !== 'all'
          && data.eventName !== 'all'
          && fData.validateEvent !== data.eventName) {
        return null;
      }
      // ---
      // --- Validator logic ---
      const urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g; // eslint-disable-line max-len
      if (data.fieldValue.match(urlRegEx)) {
        return false;
      }
      if (fData.errorMsg) {
        return fData.errorMsg;
      }
      return '${capitalizeFirstLetter(data.fieldName)} must be correct url';
      // ---
    }
    // --- Retur func if args and run if not
    if (funcReturn) {
      return returnFunc;
    }
    return returnFunc.apply(this, [fData]);
    // ---
  }
};

const validateObj = {
  validate(eventName = 'all', fields = this.state.fields,
  clearErrors = false, errors = this.state.errors) {
    const data = {};
    if (clearErrors) {
      errors = {}; // eslint-disable-line no-param-reassign
    }

    for (const [fieldName, validatorsObj] of Object.entries(fields)) {
      const field = ReactDOM.findDOMNode(this.refs[fieldName]);
      if (!field) {
        delete errors[fieldName];
        continue;
      }

      let fieldValue = field.value;
      if (field.type === 'checkbox') {
        fieldValue = field.checked;
      } else if (field.type === 'radio') {
        for (const radio of field.form.querySelectorAll(`input[name=${field.name}]`)) {
          if (radio.checked) {
            fieldValue = radio.value;
            break;
          }
        }
      }
      let validators = [];

      if (validatorsObj !== null
          && Object.prototype.toString.call(validatorsObj) !== '[object Array]') {
        const validatorsType = typeof validatorsObj;

        if (validatorsType === 'function') {
          validators = [validatorsObj];
        } else if (validatorsType === 'object') {
          if (validatorsObj.depends) {
            const res = this.validate('all', validatorsObj.depends, false, {});
            if (Object.keys(res.errors).length !== 0) {
              delete errors[fieldName];
              if (validatorsObj && validatorsObj.converter) {
                fieldValue = validatorsObj.converter.apply(this, [{ value: fieldValue, field }]);
              }

              data[fieldName] = fieldValue;
              continue;
            }
          }
          if (validatorsObj.validateBefore) {
            const validateFields = {};
            for (const f of validatorsObj.validateBefore) {
              validateFields[f] = this.state.fields[f];
            }
            const res = this.validate('all', validateFields);
            this.setState({ errors: res.errors });
          }
          if (typeof validatorsObj.validators === 'function') {
            validators = [validatorsObj.validators];
          } else {
            validators = validatorsObj.validators;
          }
        }
      } else {
        validators = validatorsObj;
      }
      if (!validators) {
        validators = [];
        delete errors[fieldName];
      }

      for (const validator of validators) {
        if (!validatorRun.apply(this,
              [validator, errors, eventName, fieldName, fieldValue, field, this.refs]
          )) {
          break;
        }
      }
      // Converter
      if (validatorsObj && validatorsObj.converter) {
        fieldValue = validatorsObj.converter.apply(this, [{ value: fieldValue, field }]);
      }

      data[fieldName] = fieldValue;
    }

    return { errors, data };
  },

  validators: validatorsHelpers,
  converters: convertersHelpers
};

export default validateObj;
