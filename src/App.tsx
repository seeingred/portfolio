import { forwardRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import { LinkProps } from '@mui/material/Link';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    Link as RouterLink,
    LinkProps as RouterLinkProps
} from 'react-router-dom';

import Main from './routes/Main';
import Chains from './routes/Chains';
import Address from './routes/Address';
import Addresses from './routes/Addresses';
import Tokens from './routes/Tokens';
import Token from './routes/Token';
import Settings from './routes/Settings';

export const LinkBehavior = forwardRef<
    any,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;
    // Map href (MUI) -> to (react-router)
    return (
        <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />
    );
});

const theme = createTheme({
    components: {
        MuiLink: {
            defaultProps: {
                component: LinkBehavior
            } as LinkProps
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehavior
            }
        },
        MuiListItemButton: {
            defaultProps: {
                LinkComponent: LinkBehavior
            }
        }
    },
    palette: {
        mode: 'dark'
    }
});

const App = (): JSX.Element => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/chains" element={<Chains />} />
                    <Route path="/address" element={<Address />} />
                    <Route path="/address/:chain" element={<Address />} />
                    <Route path="/address/:chain/:address" element={<Address />} />
                    <Route path="/addresses" element={<Addresses />} />
                    <Route path="/addresses/:chain" element={<Addresses />} />
                    <Route path="/tokens/:chain" element={<Tokens />} />
                    <Route path="/token" element={<Token />} />
                    <Route path="/token/:chain" element={<Token />} />
                    <Route path="/token/:chain/:ticker" element={<Token />} />
                    <Route path="/settings/:chain" element={<Settings />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
