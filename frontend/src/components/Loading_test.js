import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading', () => {
  test('renders children with no loading, no failures', () => {
    render(<Loading loads={[{ loading: false, error: undefined }]} errorOnly={[]}>looks ok</Loading>);
    const looksOk = screen.getByText(/looks ok/);
    expect(looksOk).toBeInTheDocument();
  });

  test('renders children without errorOnly ', () => {
    render(<Loading loads={[]}>looks ok</Loading>);
    const looksOk = screen.getByText(/looks ok/);
    expect(looksOk).toBeInTheDocument();
  });

  test('renders progress when something is loading', () => {
    render(<Loading loads={[{ loading: true }, { loading: false }]}>looks ok</Loading>);
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  test('renders error when something fails', () => {
    render(<Loading loads={[{ error: new Error('uhoh') }, { loading: false }]}>looks ok</Loading>);
    const err = screen.getByText(/uhoh/);
    expect(err).toBeInTheDocument();
  });

  test('ignores loading things in errorOnly', () => {
    render(<Loading loads={[]} errorOnly={[{ lodaing: true }]}>looks ok</Loading>);
    const err = screen.getByText(/looks ok/);
    expect(err).toBeInTheDocument();
  });

  test('renders error insteead of progress bar when something fails while something is still loading', () => {
    render(
      <Loading loads={[
        { error: new Error('uhoh') },
        { loading: true }]}>
        looks ok
      </Loading>);
    const err = screen.getByText(/uhoh/);
    expect(err).toBeInTheDocument();
  });
});
