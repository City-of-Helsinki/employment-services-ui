export const deleteCookie = (event: any, name: string, history: any) => {
  event.preventDefault();
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  history.go(0)
}