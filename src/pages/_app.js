import {SessionProvider} from "next-auth/react";
import "../styles/globals.css";

export default function App({Component,pageProps}){
    return(
        <SessionProvider session={pageProps.session}>
        <main data-theme="forest">
        <Component {...pageProps} />
        </main>
        </SessionProvider>
     
    )
}