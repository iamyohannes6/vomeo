import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  return (
    <main className="pt-16">
      {children}
    </main>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout; 