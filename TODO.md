0. Setup docker + docker-compose
    2. Prod env
    3. Those envs should use separate database
    4. Optimize dev setup because docker compose watch build images everytime
2. Add auth
    - credentials
    - oAuth
3. Add cache
4. Configure prod env
5. Deploy to AWS
    - add custom domain
6. Configure Github Actions
7. Add Sentry
8. Track number of accesses to url
9. use shortUrl as id
10. keep shortUrl in database without the base url
11. add simple meta data - create_at, count (how many times accessed)
12. creators should be able to delete their short urls
13. show table with user own short urls
14. learn to calculate the space data is using in DB
15. short urls should have 6-8 characters
16. index on short url column