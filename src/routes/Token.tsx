import {
    ArrowBack as IconArrowBack,
    Add as IconAdd
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
    Stack
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { StorageCrypto } from '../store/storage';
import { chainInfo } from '../types/local';
import supportedChainsInfos from '../chains';
import { FormEvent, ChangeEvent, SyntheticEvent } from 'react';
import { StorageToken } from '../store/storage';
import { addOrModifyToken } from '../store/storage';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const supportedChains = Object.keys(supportedChainsInfos);
const firstSupportedChain = supportedChains[0];
const defaultDecimal = 18;

export default function Token(): JSX.Element {
    const { t } = useTranslation();
    const d = useDispatch();
    const nav = useNavigate();
    let { chain, ticker } = useParams();
    const foundChain =
        supportedChains.find((c) => c === chain) || firstSupportedChain;
    const cryptos = useSelector((state: RootState) => state.storage.cryptos);
    const crypto = cryptos.find((c) => c.chain === foundChain);
    const existingToken = crypto?.tokens.find(t => t.ticker === ticker?.toUpperCase() || '');

    const [newToken, setNewToken] = useState<StorageToken>({
        ticker: ticker?.toUpperCase() || '',
        contract: existingToken?.contract || '',
        decimal: existingToken?.decimal || defaultDecimal,
        comment: existingToken?.comment || ''
    });

    useEffect(() => {
        if (!crypto) {
            nav(`/chains`, { replace: true });
        } else {
            const { ticker } = newToken;
            if (ticker) {
                nav(`/token/${crypto.chain}/${ticker.toLowerCase()}`, { replace: true });
            }
        }
    }, [crypto]);

    if (!crypto) {
        return <></>;
    }

    const chainInfo = supportedChainsInfos[crypto.chain];

    function addToken(event: FormEvent) {
        event.preventDefault();
        const { ticker, contract, decimal } = newToken;
        if (!ticker || !contract || !decimal) return;

        d(addOrModifyToken(crypto?.chain || '', newToken));
        nav('/tokens/' + crypto?.chain);
    }

    function handleChange(event: any, type: string) {
        if (!event) {
            return;
        }
        // todo validation error on same contract
        setNewToken({
            ...newToken,
            [type]: event.target.value
        });
    }

    function handleChangeTicker(event: any) {
        if (!event) {
            return;
        }
        setNewToken({
            ...newToken,
            ticker: event.target.value.toUpperCase()
        });
    }

    function handleChangeDecimal(event: any) {
        if (!event) {
            return;
        }
        const intDecimal = parseInt(event.target.value);
        if (!intDecimal) {
            // todo validation error
            return
        }
        setNewToken({
            ...newToken,
            decimal: intDecimal
        });
    }

    return (
        <Container
            maxWidth="sm"
            sx={{
                height: '100%',
                position: 'relative'
            }}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        href={`/tokens/${crypto.chain}`}
                        aria-label="close"
                    >
                        <IconArrowBack />
                    </IconButton>
                    <Typography
                        sx={{ ml: 2, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        {t('Add token for {{chain}}', {
                            chain: crypto?.chain.toUpperCase()
                        })}
                    </Typography>
                </Toolbar>
            </AppBar>

            <form onSubmit={addToken}>
                <Stack spacing={4} sx={{ mt: 4 }}>
                <TextField
                        value={newToken.ticker}
                        label={
                            t('Ticker')
                        }
                        variant="outlined"
                        onChange={handleChangeTicker}
                    />
                    <TextField
                        value={newToken.contract}
                        label={
                            (chainInfo.contractFieldLabel &&
                                chainInfo.contractFieldLabel()) ||
                            t('Contract address')
                        }
                        variant="outlined"
                        onChange={(event) => handleChange(event, 'contract')}
                    />
                    <TextField
                        value={newToken.decimal}
                        label={
                            t('Number of digits after decimal point)')
                        }
                        variant="outlined"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => handleChangeDecimal(event)}
                    />
                    <TextField
                        value={newToken.comment}
                        label="Comment (optional)"
                        variant="outlined"
                        onChange={(event) => handleChange(event, 'comment')}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={addToken}
                        size="large"
                    >
                        Save
                    </Button>
                </Stack>
            </form>
        </Container>
    );
}
