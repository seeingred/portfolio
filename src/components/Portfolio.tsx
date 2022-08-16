import { useState, useEffect } from 'react';
import { round } from '../round';
import { fetchJson } from '../fetchJson';
import { log } from '../log';

import type { coin } from '../types/local';
import type { coinList, prices } from '../types/coinGeckoApi';

import { useSelector } from 'react-redux';
import { RootState } from '../store/';

import {
    ArrowBack as IconArrowBack,
    Add as IconAdd,
    Settings as IconsSettings,
    RemoveRedEye as IconEye
} from '@mui/icons-material';
import {
    Button,
    Autocomplete,
    TextField,
    Container,
    Card,
    Typography,
    CardContent,
    Link,
    IconButton,
    Toolbar,
    AppBar,
    Divider,
    List,
    ListItem,
    ListItemText,
    Dialog,
    Fab,
    Stack,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Popover,
    ListItemButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LinkBehavior } from '../App';

function addCoins(data: coin[], coins: coin[]): coin[] {
    for (const coin of data) {
        coin.code = coin.code.toUpperCase();
        if (coin.amount > 0) {
            const existingCoin = coins.find((c) => c.code === coin.code);
            if (existingCoin) {
                existingCoin.amount += coin.amount;
            } else {
                coins.push(coin);
            }
        }
    }
    return coins;
}

export default function Portfolio(): JSX.Element {
    const cryptos = useSelector((state: RootState) => state.storage.cryptos);
    const [notFoundCoins, setNotFoundCoins] = useState<string[]>([]);
    const [zeroCoins, setZeroCoins] = useState<string[]>([]);
    const [coins, setCoins] = useState<coin[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();

    // localStorage.setItem('addresses', '[{"chain":"trx","addresses":[""]},{"chain":"sol","addresses":[""]}]');
    // localStorage.setItem('addresses', '[{"chain":"btc","addresses":[""]}]');
    // localStorage.setItem('apiKeys', '[{"chain":"eth","apiKey":""}]');

    async function fetchData() {
        setNotFoundCoins([]);
        let newCoins: coin[] = [...coins];
        for (const addressInfo of cryptos) {
            const { extraFunds, chain } = addressInfo;
            if (extraFunds || 0 > 0) {
                const coin = {
                    code: chain.toUpperCase(),
                    amount: extraFunds || 0,
                    price: 0,
                    total: 0
                };
                newCoins.push(coin);
            }
            const { fetchAssets, fetchMultipleAddresses } = await import(
                `../chains/${addressInfo.chain}`
            );
            if (fetchMultipleAddresses) {
                const data: coin[] = await fetchAssets(
                    addressInfo.addresses.map((a) => a.value),
                    addressInfo.tokens,
                    addressInfo.apiKey
                );
                newCoins = addCoins(data, newCoins);
            } else {
                for (const address of addressInfo.addresses) {
                    const data: coin[] = await fetchAssets(
                        address.value,
                        addressInfo.tokens,
                        addressInfo.apiKey
                    );
                    newCoins = addCoins(data, newCoins);
                }
            }
        }

        const coinSymbols = newCoins.map((c) => c.code.toUpperCase());
        const coinList: coinList[] = await fetchJson(
            `https://api.coingecko.com/api/v3/coins/list`
        );
        let coinIds: string[] = [];
        let newNotFoundTokens = [...notFoundCoins];
        for (const c of coinSymbols) {
            const coinSymbol = c.toUpperCase();
            const coin = coinList.find(
                (coin) => coin.symbol.toUpperCase() === coinSymbol
            );
            if (!coin) {
                newNotFoundTokens.push(coinSymbol);
                const index = newCoins.findIndex((coin) => coin.code === c);
                newCoins.splice(index, 1);
                continue;
            }
            coinIds.push(coin.id);
        }

        setNotFoundCoins(newNotFoundTokens);
        const data: prices = await fetchJson(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
        );

        for (const coinId in data) {
            const coinExternal = coinList.find((coin) => coin.id === coinId);
            if (!coinExternal) {
                continue;
            }
            const coin = newCoins.find(
                (c) =>
                    c.code.toUpperCase() === coinExternal.symbol.toUpperCase()
            );
            if (!coin) {
                continue;
            }
            coin.price = data[coinId].usd;
            coin.total = coin.price * coin.amount;
        }
        let newZeroCoins: string[] = [];
        for (let i = 0; i < newCoins.length; i++) {
            const coin = newCoins[i];
            if (!coin.total || parseFloat(round(coin.total)) <= 0) {
                newZeroCoins.push(coin.code);
                newCoins.splice(i, 1);
            }
        }
        setZeroCoins(newZeroCoins);

        setCoins(newCoins);

        let newTotal: number = newCoins
            .map((coin) => coin.total)
            .reduce((a, b) => a + b, 0);
        setTotal(newTotal);
        // if (newCoins.length) {
        setLoading(false);
        // }
    }

    useEffect((): void => {
        setLoading(true);
    }, []);

    useEffect((): void => {
        setLoading(true);
        fetchData();
    }, [cryptos]);

    function renderChange(): string {
        return '+ 10000000 / 10% since 22/04/22 22:24';
    }

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleSettingsClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSettingsClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'popover' : undefined;

    return (
        <Container
            maxWidth="sm"
            sx={{
                height: '100%',
                position: 'relative'
            }}
        >
            <AppBar sx={{ position: 'relative' }} enableColorOnDark={true}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="close"
                        onClick={handleSettingsClick}
                    >
                        <IconsSettings />
                    </IconButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleSettingsClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                    >
                        <List>
                            <ListItemButton
                                component={LinkBehavior}
                                href={`/chains`}
                            >
                                <ListItemText
                                    primary={t('Chains & addresses')}
                                />
                            </ListItemButton>
                            <ListItemButton
                                component={LinkBehavior}
                                href={`/settings`}
                            >
                                <ListItemText primary={t('Settings')} />
                            </ListItemButton>
                        </List>
                    </Popover>
                    <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
                        <Typography
                            sx={{ ml: 2, mr: 2 }}
                            variant="h6"
                            component="div"
                        >
                            {t('Total: {{total}}', { total: round(total) })}{' '}
                        </Typography>
                        {loading ? <div>{t('Loading...')}</div> : null}
                    </Stack>
                    {false ? (
                        <IconButton
                            edge="start"
                            color="inherit"
                            href="/"
                            aria-label="close"
                        >
                            <IconEye />
                        </IconButton>
                    ) : null}
                </Toolbar>
            </AppBar>
            <TableContainer component={Paper}>
                <Table aria-label="Portfolio">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Code')}</TableCell>
                            <TableCell align="right">
                                {t('Amount (~)')}
                            </TableCell>
                            <TableCell align="right">
                                {t('Price (USD)')}
                            </TableCell>
                            <TableCell align="right">
                                {t('Amount in USD')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coins.map((coin) => {
                            return (
                                <TableRow
                                    key={coin.code}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0
                                        }
                                    }}
                                    hover
                                >
                                    <TableCell component="th" scope="row">
                                        {coin.code}
                                    </TableCell>
                                    <TableCell align="right">
                                        {round(coin.amount, 8)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {round(coin.price)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {round(coin.total)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {total > 0 ? (
                <Stack direction="column" spacing={0} sx={{ mt: 2 }}>
                    <Typography
                        variant="h5"
                        sx={{ textAlign: 'right', marginRight: 2, mb: 1 }}
                        component="div"
                    >
                        {t('${{amount}}', {
                            amount: round(total)
                        })}
                    </Typography>

                    <Stack direction="row" justifyContent="flex-end">
                        {false ? (
                            <Chip
                                label={renderChange()}
                                color="success"
                                variant="outlined"
                            />
                        ) : null}
                    </Stack>
                </Stack>
            ) : null}
            {notFoundCoins.length ? (
                <Typography variant="caption" display="block" sx={{ m: 2 }}>
                    {t('Not found coins: {{coinsList}}', {
                        coinsList: notFoundCoins.join(t(', '))
                    })}
                </Typography>
            ) : null}
            {zeroCoins.length ? (
                <Typography variant="caption" display="block" sx={{ m: 2 }}>
                    {t('Coins < $0.00: {{coinsList}}', {
                        coinsList: zeroCoins.join(t(', '))
                    })}
                </Typography>
            ) : null}
        </Container>
    );
}
