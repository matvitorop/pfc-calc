import { useEffect, useState } from "react";
import { graphqlFetch } from "../GraphQL/fetchRequest";

export const useAuthCheck = () => {
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchAuth = async () => {
            const q = `query isAuthorize { isAuthorized }`;

            const res = await graphqlFetch<{ isAuthorized: boolean }>(q, {}, true);

            setAuthorized(res.data?.isAuthorized ?? false);
        };

        fetchAuth();
    }, []);

    return authorized;
};