export const logDate = () => {
  const currentDate = new Date(Date.now());
  console.log(`${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`);
};
