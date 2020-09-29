import { get } from 'lodash';
import { DynamicForm, BizDynamicFormComponent } from '@bizcom/dynamic-form-qaxd';

const plugins = get(window, '__DYNAMIC_FORM_PLUGINS__', {});

Object.values(plugins).forEach(plugin => DynamicForm.registerField(plugin));

export default BizDynamicFormComponent;
