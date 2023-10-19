export class Constant {
  public static Pattern = {
    Form: {
      Name: /^(?!.*\s$)[a-zA-ZéáíóúÁÉÍÓÚñÑ' ]+$/,
      Username: /^(?!.*[._-]$)(?!^[._-])(?!.*[._-]{2})[a-zA-Z0-9._-]+$/,
      Phone: /^[0-9][0-9]*/,
      Direction: /^[0-9a-zA-ZñÑáÁéÉíÍóÓúÚüÜ\s\.,#'-]+$/,
      Email: /^(([a-zA-Z0-9]([\.\-\_]){1})|([a-zA-Z0-9]))+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4}|[a-zA-Z]{1,3}\.[a-zA-Z]{2,3})$/,
      Password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\-.,#])[A-Za-z\d_\-.,#]{6,12}$/,
    },
  };

  public static SUCCESS = 'SUCCESS';
  public static ERROR = 'ERROR';
}