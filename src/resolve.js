import * as R from 'ramda';

export const resolveEnv = prop =>
    R.either(
        R.path(['window', 'env', prop]),
        R.path(['process', 'env', prop]),
    )({ process, window: global });
