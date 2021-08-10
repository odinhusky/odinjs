// # 縮寫type 的形式

type SoN = string | number;
type objWithName = {name: string, uid: SoN}

const logDetails = (uid: string | number, item: string) => {
  console.log(`${item} has a uid of ${uid}`)
}

const greet = (user: {name: string, uid: number | string}) => {
  console.log(`${user.name} says hello`);
}

const greetAgain = (user: objWithName) => {
  console.log(`${user.name} says hello`);
}
