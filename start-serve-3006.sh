#!/bin/bash
export $(cat .env.dev3006 | xargs)
serve -s build -l $PORT
