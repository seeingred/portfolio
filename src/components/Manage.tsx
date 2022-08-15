import {
    ArrowBack as IconArrowBack,
    Add as IconAdd,
    Settings as IconsSettings,
    Remove as IconRemove
} from '@mui/icons-material';
import {
    Button,
    Container,
    Typography,
    IconButton,
    Toolbar,
    AppBar,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Fab,
    Stack,
    Checkbox,
    Popover
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { StorageCrypto } from '../store/storage';
import { useParams } from 'react-router-dom';
import { LinkBehavior } from '../App';
import { useNavigate } from 'react-router-dom';

export type renderItemParams = {
    values: {
        primary: string;
        secondary: string;
    };
    itemNumber: number;
    length: number
};

type ManageProps = {
    renderListItems: (chain: string) => JSX.Element;
    action: (chain: string, checked: string[]) => void;
    renderItems: (
        crypto: StorageCrypto,
        renderItem: (params: renderItemParams) => JSX.Element,
    ) => JSX.Element;
    getAddHref: (chain: string) => string;
    getEditHref: (chain: string, primaryField: string) => string;
    getHeader: (chainUpperCase: string) => string;
};

export default function Manage({
    renderListItems,
    action,
    renderItems,
    getAddHref,
    getEditHref,
    getHeader
}: ManageProps): JSX.Element {
    const { t } = useTranslation();
    const d = useDispatch();
    let { chain } = useParams();
    const nav = useNavigate();

    const cryptos = useSelector((state: RootState) => state.storage.cryptos);
    const crypto = cryptos.find((c) => c.chain === chain);

    const [checked, setChecked] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.findIndex((v) => v === value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const remove = () => {
        if (!crypto) {
            return;
        }
        d(action(crypto.chain, checked));
        setChecked([]);
        setIsEditing(false);
    };

    function renderItem({ itemNumber, values, length }: renderItemParams): JSX.Element {
        if (!crypto) {
            return <></>;
        }
        const item: JSX.Element = (
            <ListItemButton
                key={itemNumber}
                {...(() => {
                    if (isEditing) {
                        return {
                            onClick: handleToggle(values.primary)
                        };
                    } else {
                        return {
                            href: getEditHref(crypto.chain, values.primary),
                            component: LinkBehavior
                        };
                    }
                })()}
            >
                {isEditing ? (
                    <Checkbox
                        edge="start"
                        checked={checked.indexOf(values.primary) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                            'aria-labelledby': `checkbox-list-label-${values.primary}`
                        }}
                    />
                ) : null}
                <ListItemText
                    primary={values.primary}
                    secondary={
                        <Stack
                            direction="column"
                            sx={{ my: 1 }}
                            component="span"
                        >
                            <Typography variant="body2" component="span">
                                {values.secondary}
                            </Typography>
                        </Stack>
                    }
                />
            </ListItemButton>
        );
        if (itemNumber === length - 1) {
            return item;
        } else {
            return (
                <React.Fragment key={itemNumber}>
                    {item}
                    <Divider />
                </React.Fragment>
            );
        }
    }

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );

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

    useEffect(() => {
        if (!crypto) {
            nav('/addresses', { replace: true });
        }
    }, [crypto]);

    return (
        <Container
            maxWidth="sm"
            sx={{
                height: '100%',
                position: 'relative'
            }}
        >
            {crypto ? (
                <>
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                href="/chains"
                                aria-label="close"
                            >
                                <IconArrowBack />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                aria-label="close"
                                aria-describedby={id}
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
                                    {renderListItems(crypto.chain)}
                                    <ListItemButton
                                        component={LinkBehavior}
                                        href={`/settings/${crypto.chain}`}
                                    >
                                        <ListItemText
                                            primary={t('Chain settings')}
                                        />
                                    </ListItemButton>
                                </List>
                            </Popover>
                            <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="h6"
                                component="div"
                            >
                                {getHeader(crypto.chain.toUpperCase())}
                            </Typography>
                            <Button
                                autoFocus
                                color="inherit"
                                onClick={handleEdit}
                            >
                                {isEditing ? t('Done') : t('Edit')}
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <List>{renderItems(crypto, renderItem)}</List>
                    <Fab
                        sx={{ position: 'absolute', bottom: 16, right: 16 }}
                        aria-label={t('Add')}
                        color="primary"
                        {...(() => {
                            if (isEditing) {
                                return {
                                    onClick: remove
                                };
                            } else {
                                return {
                                    href: getAddHref(crypto.chain)
                                };
                            }
                        })()}
                    >
                        {isEditing ? <IconRemove /> : <IconAdd />}
                    </Fab>
                </>
            ) : null}
        </Container>
    );
}
