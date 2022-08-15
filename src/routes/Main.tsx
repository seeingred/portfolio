import { useSelector } from 'react-redux';
import Portfolio from '../components/Portfolio';
import Welcome from '../components/Welcome';

import { RootState } from '../store/';

export default function App(): JSX.Element {
    const cryptos = useSelector((state: RootState) => state.storage.cryptos);
    return cryptos.length ? <Portfolio /> : <Welcome />;
}
