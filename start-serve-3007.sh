#!/bin/bash
export $(cat .env.dev3007 | xargs)
serve -s build -l $PORT
