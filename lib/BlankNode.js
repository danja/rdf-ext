const BlankNode = require('rdf-data-model/lib/blank-node')

/**
 * Class representing a blank node, with rendering functions.
 * (A blank node represents a resource for which a URI or literal is not given).
 * See also : {@link https://github.com/rdfjs/representation-task-force/blob/master/interface-spec.md#blanknode-extends-term BlankNode interface specification}
  * @extends BlankNode
 */
class BlankNodeExt extends BlankNode {

  /**
   * Get a canonical value for the node.
   * @return {string} The canonical value.
   */
  toCanonical () {
    return '_:' + this.value // TODO: escape special chars
  }

  /**
   * Get a string representation for the node.
   * @return {string} The string representation.
   */
  toString () {
    return this.toCanonical()
  }

  /**
   * Get a structured representation for the node of form { value, type }
   * @return {string} The JSON representation.
   */
  toJSON () {
    return {
      value: this.value,
      termType: this.termType
    }
  }
}

module.exports = BlankNodeExt
