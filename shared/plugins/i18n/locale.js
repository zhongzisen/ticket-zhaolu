const LOCALES = ['zh-CN', 'en-US'];
const favor = localStorage.getItem('TRANTOR-LOCALE');
const locale =  favor && LOCALES.indexOf(favor) > -1 ? favor : 'zh-CN';
export default locale;
