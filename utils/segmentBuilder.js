const buildMongoQueryFromRules = (rules) => {
  const query = {};

  rules.forEach((ruleGroup) => {
    const conditions = [];

    ruleGroup.rules.forEach((rule) => {
      const { field, operator, value } = rule;
      let condition = {};

      switch (operator) {
        case "equals":
          condition[field] = value;
          break;
        case "notEquals":
          condition[field] = { $ne: value };
          break;
        case "greaterThan":
          condition[field] = { $gt: value };
          break;
        case "lessThan":
          condition[field] = { $lt: value };
          break;
        case "contains":
          condition[field] = { $regex: value, $options: "i" };
          break;
        case "notContains":
          condition[field] = { $not: { $regex: value, $options: "i" } };
          break;
        case "inLast":
          const days = parseInt(value);
          condition[field] = {
            $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          };
          break;
        case "notInLast":
          const daysNot = parseInt(value);
          condition[field] = {
            $lt: new Date(Date.now() - daysNot * 24 * 60 * 60 * 1000),
          };
          break;
      }

      conditions.push(condition);
    });

    if (conditions.length > 0) {
      if (ruleGroup.condition === "AND") {
        query.$and = (query.$and || []).concat(conditions);
      } else {
        query.$or = (query.$or || []).concat(conditions);
      }
    }
  });

  return query;
};

export { buildMongoQueryFromRules };
