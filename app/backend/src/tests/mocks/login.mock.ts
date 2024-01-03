export const loginEnter = {
    "email": "admin@admin.com",
    "password": "secret_admin"
}

export const loginWrongEnter = {
    "email": "admin.com",
    "password": "sec"
}

export const loginReturn = { 
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY4OTcwODY5NCwiZXhwIjoxNjkwOTE4Mjk0fQ.ZEejvTmdsP_oSOP55XaDx5cw73NWex3P9ndgNaQ3KLw'
  };   

export const loginWrongReturn = { message: 'Invalid email or password' }