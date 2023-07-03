import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import moment from 'moment';

export default function renderArrayMultiline(arr = []) {
  if (!arr || !Array.isArray(arr)) {
    return;
  }

  return arr?.map((e) => {
    return (
      <>
        {e}
        <br />
      </>
    );
  });
}

export function getDateInFormat(v, dateFormat, locale) {
  let d = new Date();

  try {
    // moment.locale(locale);
    // const localeData = moment.localeData();
    // const format = localeData.longDateFormat('L');
    // const a = moment(v, format).format('YYYY-MM-DD'); // '2021-06-07'
    // console.log(a); // '2021-06-07'
    // return a;

    d = format(new Date(v), dateFormat, {
      locale: enGB
    });
    console.log(d);
  } catch (error) {
    console.log(error);
  }

  return d;
}

export function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}
