import {t} from 'i18next';
import {chainInfos} from '../types/local';

const supportedChains: chainInfos = {
    avax: {
        fullName: () => t('AVAX'),
        addressTrim: 4
    },
    bnb: {
        fullName: () => t('BNB - Binance smart chain and BEP20 tokens'),
        addressTrim: 4,
        contractFieldLabel: () => t('BEP20 contract address')
    },
    btc: {
        fullName: () => t('BTC - Bitcoin and OMNI tokens'),
        addressTrim: 4,
        contractFieldLabel: () => t('Token ID')
    },
    btt: {
        fullName: () => t('BTT'),
        addressTrim: 4
    },
    cet: {
        fullName: () => t('CET'),
        addressTrim: 4
    },
    dot: {
        fullName: () => t('DOT'),
        addressTrim: 4
    },
    eth: {
        fullName: () => t('ETH'),
        addressTrim: 4
    },
    matic: {
        fullName: () => t('Polygon'),
        addressTrim: 4
    },
    near: {
        fullName: () => t('NEAR'),
        addressTrim: 4
    },
    sol: {
        fullName: () => t('SOL'),
        addressTrim: 4
    },
    trx: {
        fullName: () => t('TRX - Tron and TRC20 tokens'),
        addressTrim: 4
    }
}

export default supportedChains;