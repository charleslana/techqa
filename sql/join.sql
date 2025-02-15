SELECT code
FROM public."TwoFactorCode" t
         JOIN public."User" u ON u.id = t."userId"
WHERE u.cpf = '01234567890'
ORDER BY t.id DESC
    LIMIT 1;