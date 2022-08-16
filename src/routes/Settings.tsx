import { ArrowBack as IconArrowBack } from '@mui/icons-material';
import {
    Button,
    Container,
    Typography,
    IconButton,
    Toolbar,
    AppBar,
    Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { ChangeEvent } from 'react';
import { saveAllSettingsThunk } from '../store/storage';
import { log } from '../log';

export default function Settings(): JSX.Element {
    const { t } = useTranslation();
    const d = useDispatch();
    const cryptos = useSelector((state: RootState) => state.storage.cryptos);

    const exportConfig = () => {
        const element = document.createElement('a');
        const file = new Blob([JSON.stringify(cryptos)], {
            type: 'text/json'
        });
        element.href = URL.createObjectURL(file);
        element.download = 'portfolio.export.json';
        document.body.appendChild(element);
        element.click();
    };

    function importConfig(event: ChangeEvent<HTMLInputElement>) {
        if (!event || !event.target || !event.target.files) return;
        let reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
            const newConfig = String(reader.result);
            try {
                const newConfigObj = JSON.parse(newConfig);
                d(saveAllSettingsThunk(newConfigObj));
            } catch {
                log(`reader.result:  `, reader.result);
            }
        };
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
                        href={`/`}
                        aria-label="close"
                    >
                        <IconArrowBack />
                    </IconButton>
                    <Typography
                        sx={{ ml: 2, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        {t('Settings')}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* <form onSubmit={saveSettings}> */}
            <Stack spacing={4} sx={{ mt: 4 }}>
                <Button variant="contained" onClick={exportConfig} size="large">
                    Export config
                </Button>
                <Button variant="contained" component="label" size="large">
                    Import
                    <input type="file" hidden onChange={importConfig} />
                </Button>
            </Stack>
            {/* </form> */}
        </Container>
    );
}
