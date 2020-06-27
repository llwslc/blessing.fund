import { observable } from 'mobx';
import Config from '../config';

class FundStore {
  @observable isTronLinkVaild = false;
  @observable address = '';
  @observable balance = 0;

  setTronLink = () => {
    const check = async () => {
      if (window.tronWeb && window.tronWeb.ready) {
        this.isTronLinkVaild = true;
        this.address = window.tronWeb.defaultAddress.base58;

        console.log(Config.contract.USDT);
      } else {
        this.isTronLinkVaild = false;
      }
    };

    check();
    setInterval(() => {
      check();
    }, 3000);
  };
}

const Fund = new FundStore();
export default Fund;
