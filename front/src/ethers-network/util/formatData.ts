const formatAddress = (address?: string, name?: string) => {
  let addressStr

  if (address) {
    if (address.startsWith("0x") && address.length > 9) {
      addressStr = address.substring(0, 5) + '...' + address.substring(address.length - 4)
    } else {
      addressStr = address
    }

  }

  if (name) {
    if (addressStr) {
      return name + ' (' + addressStr + ')'
    }
    return name
  } else if (addressStr) {
    return addressStr
  }

  return ''
}

export { formatAddress }
