import {useEffect, useState} from "react";
import {environment} from "../../../../../environments/environment";
import axios, {AxiosResponse} from "axios";

export type IActivityFontConfig = {
    fontHref: string;
    fontWeight: string;
    fontFamily: string;
    fontStyle: string;
    fontStrokeWidth:string;
    fontStrokeWidthForMobile:string;
    fontLetterSpacing?: string;
}


export const useActivityFontConfig = () => {
    const [fontConfig, setFontConfig] = useState<IActivityFontConfig>();

    useEffect(() => {
        const link1 = document.createElement('link');
        link1.href = "https://fonts.googleapis.com";
        link1.rel = 'preconnect';
        document.head.appendChild(link1);

        const link2 = document.createElement('link');
        link2.href = "https://fonts.gstatic.com";
        link2.rel = 'preconnect';
        link2.crossOrigin = "anonymous"
        document.head.appendChild(link2);

        const link3 = document.createElement('link');
        if (fontConfig) {
            link3.href = fontConfig.fontHref;
            link3.rel = 'stylesheet';
            document.head.appendChild(link3);
        }

        return () => {
            document.head.removeChild(link1);
            document.head.removeChild(link2);
            if (fontConfig) {
                document.head.removeChild(link3);
            }
        };
    }, [fontConfig]);

    useEffect(() => {
        const loadFontConfig = async () => {
            try {
                const response: AxiosResponse<IActivityFontConfig> = await axios.get(`assets/${environment.uVersion}/${environment.mVersion}/activity_font_config.json`);
                setFontConfig(response.data);
            } catch (error) {
                console.error('===> jsonData Error fetching font config:', error);
            }
        };
        loadFontConfig();
    }, []);

    return {
        fontConfig
    }
}