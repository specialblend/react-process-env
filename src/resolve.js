import * as R from 'ramda';

export const resolve = prop =>
    R.either(
        R.path(['window', 'env', prop]),
        R.path(['process', 'env', prop]),
    )({ process, window: global });
