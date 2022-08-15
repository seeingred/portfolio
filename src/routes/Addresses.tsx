import Manage from '../components/Manage';
import { useTranslation } from 'react-i18next';
import { ListItemButton, ListItemText } from '@mui/material';
import { removeAddressesOrAsset } from '../store/storage';
import { renderItemParams } from '../components/Manage';
import { StorageCrypto } from '../store/storage';
import { LinkBehavior } from '../App';
export default function Addresses(): JSX.Element {
    const { t } = useTranslation();
    const renderListItems = (chain: string): JSX.Element => {
        return (
            <ListItemButton component={LinkBehavior} href={`/tokens/${chain}`}>
                <ListItemText primary={t('Manage tokens')} />
            </ListItemButton>
        );
    };
    const renderItems = (
        crypto: StorageCrypto,
        renderItem: (params: renderItemParams) => JSX.Element
    ): JSX.Element => {
        return (
            <>
                {crypto.addresses.map((address, k) =>
                    renderItem({
                        values: {
                            primary: address.value,
                            secondary: address.comment
                        },
                        itemNumber: k,
                        length: crypto.addresses.length
                    })
                )}
            </>
        );
    };

    return (
        <Manage
            renderListItems={renderListItems}
            renderItems={renderItems}
            action={removeAddressesOrAsset}
            getAddHref={(chain) => '/address/' + chain}
            getEditHref={(chain, primaryField) => '/address/' + chain + '/' + primaryField}
            getHeader={(chainUpperCase) =>
                t('{{chain}} addresses', {
                    chain: chainUpperCase
                })
            }
        ></Manage>
    );
}
