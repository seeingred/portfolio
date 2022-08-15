import {
    ArrowBack as IconArrowBack,
    Add as IconAdd,
    Remove as IconRemove
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
    ListItemButton,
    ListItemText,
    Dialog,
    Fab,
    Stack,
    Checkbox
} from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/';
import { StorageCrypto, StorageAddress } from '../store/storage';
// import { chainInfo } from '../types/local';
import supportedChainsInfos from '../chains/';
import { LinkBehavior } from '../App';
import {removeAssets} from '../store/storage';

export function truncate(
    fullStr: string,
    strLen: number,
    separator: string
): string {
    if (fullStr.length <= strLen * 2 + separator.length) return fullStr;

    return (
        fullStr.substring(0, strLen) +
        separator +
        fullStr.substring(fullStr.length - strLen)
    );
}

export default function Chains(): JSX.Element {
    const { t } = useTranslation();
    const d = useDispatch()

    const cryptos = useSelector((state: RootState) => state.storage.cryptos);

    const [checked, setChecked] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.findIndex(v => v === value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleEdit = () => {
        setIsEditing(!isEditing)
    }

    const removeCryptos = () => {
        d(removeAssets(checked));
        setChecked([]);
        setIsEditing(false);
    }

    // const [infos, setInfos] = useState<{ [key: string]: chainInfo }>({});
    // const [infosUpdated, setInfosUpdated] = useState(0);
    // const infosRef = useRef(infos);

    const renderAddresses = (
        addresses: StorageAddress[],
        addressTrim = 4
    ): string[] => {
        return addresses.map((a) => truncate(a.value, addressTrim, t('...')));
    }

    const renderListString = (strings: string[], maxNumber = 3): string => {
        let completeStr = '';
        for (let i = 0; i < strings.length; i++) {
            const str = strings[i];
            completeStr += str;
            if (i == maxNumber - 1 || i == strings.length - 1) {
                break;
            } else {
                completeStr += t(', ');
            }
        }

        if (strings.length > maxNumber) {
            completeStr = t('{{list}} and {{x}} more', {
                list: completeStr,
                x: strings.length - maxNumber
            });
        }

        return completeStr;
    }

    const renderItem = (
        crypto: StorageCrypto,
        itemNumber: number
    ): JSX.Element => {
        const info = supportedChainsInfos[crypto.chain];

        function ifInfo(ifYes: string | null, ifNo: string) {
            if (info && info.fullName) {
                return ifYes || info.fullName();
            } else {
                return ifNo;
            }
        }

        const item: JSX.Element = (
            <ListItemButton
                key={crypto.chain}
                {...(() => {
                    if (isEditing) {
                        return {
                            onClick: handleToggle(crypto.chain)
                        };
                    } else {
                        return {
                            href: `/addresses/${crypto.chain}`,
                            component: LinkBehavior
                        };
                    }
                })()}
            >
                {isEditing? <Checkbox
                    edge="start"
                    checked={checked.indexOf(crypto.chain) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${crypto.chain}` }}
                    
                />: null}
                <ListItemText
                    primary={info.fullName()}
                    secondary={
                        <Stack
                            direction="column"
                            sx={{ my: 1 }}
                            component="span"
                        >
                            <Typography variant="body2" component="span">
                                {ifInfo(
                                    renderListString(
                                        renderAddresses(
                                            crypto.addresses,
                                            info?.addressTrim
                                        )
                                    ),
                                    t('Loading...')
                                )}
                            </Typography>
                            {/* <Typography variant="body2" component="span">
                                {ifInfo(
                                    renderListString([
                                        'qqq',
                                        'www',
                                        'eee',
                                        'ccc',
                                        'gggg'
                                    ]),
                                    ''
                                )}
                            </Typography> */}
                        </Stack>
                    }
                />
            </ListItemButton>
        );
        if (itemNumber === cryptos.length - 1) {
            return item;
        } else {
            return (
                <React.Fragment key={crypto.chain}>
                    {item}
                    <Divider />
                </React.Fragment>
            );
        }
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
                        href="/"
                        aria-label="close"
                    >
                        <IconArrowBack />
                    </IconButton>
                    <Typography
                        sx={{ ml: 2, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        {t('Chains')}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleEdit}>
                        {isEditing ? t('Done') : t('Edit')}
                    </Button>
                </Toolbar>
            </AppBar>
            <List>{cryptos.map((crypto, k) => renderItem(crypto, k))}</List>
            <Fab
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                aria-label={t('Add')}
                color="primary"
                {...(() => {
                    if (isEditing) {
                        return {
                            onClick: removeCryptos
                        };
                    } else {
                        return {
                            href: '/address'
                        };
                    }
                })()}
                
            >
                {isEditing? <IconRemove />: <IconAdd />}
            </Fab>
        </Container>
    );
}
