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
import { asset } from '../store/storage';
import { addAssetOrAddressAddModify } from '../store/storage';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const supportedChains = Object.keys(supportedChainsInfos);
const firstSupportedChain = supportedChains[0];

export default function Address(): JSX.Element {
    const { t } = useTranslation();
    const d = useDispatch();
    const nav = useNavigate();
    let { chain, address } = useParams();
    const foundChain = supportedChains.find(c => c === chain) || firstSupportedChain;
    const cryptos = useSelector((state: RootState) => state.storage.cryptos);
    const crypto = cryptos.find((c) => c.chain === foundChain);

    // const cryptos = useSelector((state: RootState) => state.storage.cryptos);

    const [newAsset, setNewAsset] = useState<asset>({
        chain: foundChain,
        address: address || '',
        comment: crypto?.addresses.find(a => a.value === address)?.comment || '',
    });

    function addCoin(event: FormEvent) {
        event.preventDefault();
        if (newAsset.address.length === 0) return;
        d(addAssetOrAddressAddModify(newAsset));
        nav('/addresses/' + newAsset.chain);
    }

    function handleChange(event: any, type: string) {
        if (!event) {
            return;
        }
        setNewAsset({
            ...newAsset,
            [type]: event.target.value
        });
    }

    function handleDropdownChange(event: any, newValue: string | null) {
        const existingCoin = supportedChains.find(
            (value) => value === (newValue || '').toLowerCase()
        );
        setNewAsset({
            ...newAsset,
            chain: existingCoin || foundChain
        });
    }

    useEffect(() => {
        const {address, chain} = newAsset;
        if (chain) {
            if (address) {
                nav(`/address/${chain}/${address}`, {replace: true});
            } else {
                nav(`/address/${chain}`, {replace: true});
            }
        } else {
            nav(`/address`, {replace: true});
        }
    }, [newAsset.chain, newAsset.address]);

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
                        href={`/addresses/${newAsset.chain}`}
                        aria-label="close"
                    >
                        <IconArrowBack />
                    </IconButton>
                    <Typography
                        sx={{ ml: 2, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        {t('Add chain or address')}
                    </Typography>
                </Toolbar>
            </AppBar>

            <form onSubmit={addCoin}>
                <Stack spacing={4} sx={{ mt: 4 }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={supportedChains.map(c => c.toUpperCase())}
                        value={newAsset.chain.toUpperCase()}
                        onChange={handleDropdownChange}
                        defaultValue={foundChain}
                        renderInput={(params) => (
                            <TextField {...params} label="Asset" />
                        )}
                    />
                    <TextField
                        value={newAsset.address}
                        label="Address"
                        variant="outlined"
                        onChange={(event) => handleChange(event, 'address')}
                    />
                    <TextField
                        value={newAsset.comment}
                        label="Comment (optional)"
                        variant="outlined"
                        onChange={(event) => handleChange(event, 'comment')}
                    />
                    {/* <TextField
                        value={newAsset.comment}
                        label="Api key (optional)"
                        variant="outlined"
                        onChange={(event) => handleChange(event, 'apiKey')}
                    /> */}
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={addCoin}
                        size="large"
                    >
                        Save
                    </Button>
                </Stack>
            </form>
        </Container>
    );
}
