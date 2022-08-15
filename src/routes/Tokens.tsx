import Manage from '../components/Manage';
import { useTranslation } from 'react-i18next';
import { ListItemButton, ListItemText } from '@mui/material';
import { removeTokensThunk } from '../store/storage';
import { renderItemParams } from '../components/Manage';
import { StorageCrypto } from '../store/storage';
import { LinkBehavior } from '../App';
export default function Tokens(): JSX.Element {
    const { t } = useTranslation();
    const renderListItems = (chain: string): JSX.Element => {
        return (
            <ListItemButton component={LinkBehavior} href={`/addresses/${chain}`}>
                <ListItemText primary={t('Manage addresses')} />
            </ListItemButton>
        );
    };
    const renderItems = (
        crypto: StorageCrypto,
        renderItem: (params: renderItemParams) => JSX.Element
    ): JSX.Element => {
        return (
            <>
                {crypto.tokens.map((token, k) =>
                    renderItem({
                        values: {
                            primary: token.ticker,
                            secondary: token.comment || token.contract
                        },
                        itemNumber: k,
                        length: crypto.tokens.length
                    })
                )}
            </>
        );
    };

    return (
        <Manage
            renderListItems={renderListItems}
            renderItems={renderItems}
            action={removeTokensThunk}
            getAddHref={(chain) => '/token/' + chain}
            getEditHref={(chain, primaryField) => '/token/' + chain + '/' + primaryField.toLowerCase()}
            getHeader={(chainUpperCase) =>
                t('{{chain}} tokens', {
                    chain: chainUpperCase
                })
            }
        ></Manage>
    );
}
