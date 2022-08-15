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
import { saveSettingsThunk } from '../store/storage';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const supportedChains = Object.keys(supportedChainsInfos);
const firstSupportedChain = supportedChains[0];
const defaultDecimal = 18;

export default function Settings(): JSX.Element {
    const { t } = useTranslation();
    const d = useDispatch();
    const nav = useNavigate();
    let { chain } = useParams();
    const foundChain =
        supportedChains.find((c) => c === chain) || firstSupportedChain;
    const cryptos = useSelector((state: RootState) => state.storage.cryptos);
    const crypto = cryptos.find((c) => c.chain === foundChain);

    const [newSettings, setNewSettings] = useState<{
        apiKey: string;
        extraFunds: number;
    }>({
        apiKey: crypto?.apiKey || '',
        extraFunds: crypto?.extraFunds || 0
    });

    useEffect(() => {
        if (!crypto) {
            nav(`/chains`, { replace: true });
        }
    }, [crypto]);

    if (!crypto) {
        return <></>;
    }

    function saveSettings(event: FormEvent) {
        event.preventDefault();
        d(
            saveSettingsThunk({
                chain: crypto?.chain || '',
                apiKey: newSettings.apiKey,
                extraFunds:
                    newSettings.extraFunds <= 0 ? 0 : newSettings.extraFunds
            })
        );
        nav('/addresses/' + crypto?.chain);
    }

    function handleApiKeyChange(event: any) {
        if (!event) {
            return;
        }
        setNewSettings({
            ...newSettings,
            apiKey: event.target.value
        });
    }

    function handleExtraFundsChange(event: any) {
        if (!event) {
            return;
        }
        const floatExtraFunds = parseFloat(event.target.value);
        if (!floatExtraFunds) {
            // todo validation error
            return;
        }
        setNewSettings({
            ...newSettings,
            extraFunds: floatExtraFunds
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
                        href={`/addresses/${crypto.chain}`}
                        aria-label="close"
                    >
                        <IconArrowBack />
                    </IconButton>
                    <Typography
                        sx={{ ml: 2, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        {t('{{chain}} settings', {
                            chain: crypto?.chain.toUpperCase()
                        })}
                    </Typography>
                </Toolbar>
            </AppBar>

            <form onSubmit={saveSettings}>
                <Stack spacing={4} sx={{ mt: 4 }}>
                    <TextField
                        value={newSettings.apiKey}
                        label={t('API key')}
                        variant="outlined"
                        onChange={handleApiKeyChange}
                    />
                    <TextField
                        value={newSettings.extraFunds}
                        label={t('Additional funds ({{coin}})', {
                            coin: crypto.chain.toUpperCase()
                        })}
                        variant="outlined"
                        onChange={handleExtraFundsChange}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={saveSettings}
                        size="large"
                    >
                        Save
                    </Button>
                </Stack>
            </form>
        </Container>
    );
}
