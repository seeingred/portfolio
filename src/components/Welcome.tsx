import {
    Button,
    Container,
    Card,
    Typography,
    CardContent
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Welcome(): JSX.Element {
    const { t } = useTranslation();
    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center'
            }}
        >
            <Card>
                <CardContent
                    sx={{ px: 4, display: 'flex', flexDirection: 'column' }}
                >
                    <Typography variant="h4" component="h1" sx={{ my: 2 }}>
                        {t('Welcome')}
                    </Typography>
                    <Typography variant="h5" component="h2" sx={{ my: 2 }}>
                        {t('To start using app_')}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ my: 2 }}>
                        {t('Portfolio2 is 100% client based app_')}
                    </Typography>
                    <Button
                        href="/address"
                        size="large"
                        variant="contained"
                        sx={{ my: 4, px: 4, alignSelf: 'center' }}
                    >
                        {t('Add address')}
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
}
